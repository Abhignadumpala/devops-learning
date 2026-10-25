# 06. Storage: EBS, Instance Store, EFS and S3

[← AWS notes](README.md)

## 3 kinds of storage

| Kind | Like | AWS service |
|------|------|-------------|
| **Block** | a hard disk attached to one computer | **EBS**, instance store |
| **File** | a shared network folder | **EFS** (Linux), FSx (Windows and others) |
| **Object** | an online drive: files + metadata, reached over HTTP | **S3** |

---

## EBS (Elastic Block Store)

**EBS volume** = a network disk attached to an EC2 instance. Data **stays** when the instance stops.

| Point | Meaning |
|-------|---------|
| **Tied to one AZ** | a volume in `us-east-1a` attaches only to instances in `us-east-1a` |
| Usually 1 instance | (io1/io2 multi-attach is a special case) |
| Survives stop | yes. On terminate, the **root** volume is deleted by default; extra volumes are kept |
| Resize | grow it live, then grow the partition + filesystem inside Linux |
| Encryption | with KMS; can be on by default for the account |

**Volume types:**

| Type | Kind | Use |
|------|------|-----|
| **gp3** | SSD, general purpose (default choice): 3,000 IOPS + 125 MB/s included, more can be added | boot disks, most apps |
| gp2 | older SSD: speed grows with size | replace with gp3 |
| **io2** (Block Express) | SSD, highest and steadiest IOPS | big databases |
| **st1** | HDD, high throughput | big sequential reads (logs, data processing) |
| **sc1** | HDD, cheapest | rarely used data |

**IOPS** = read/write operations per second. **Throughput** = MB per second.

**Snapshots:**
- A **snapshot** = a backup of a volume, stored by AWS in S3 behind the scenes.
- **Incremental**: only changed blocks are saved each time.
- Restore → a new volume, in **any AZ**. Copy a snapshot → use it in another region.
- **Data Lifecycle Manager** takes snapshots on a schedule.

## Instance store

Disks **physically inside** the host server. Very fast, but **data is lost** when the instance stops or terminates. Only for temporary data (cache, scratch).

| | EBS | Instance store |
|-|-----|----------------|
| Survives stop | ✅ | ❌ |
| Speed | fast | fastest |
| Use | almost everything | temporary data |

## EFS (Elastic File System)

**EFS** = a shared file system (NFS) that **many Linux instances in many AZs** can mount at the same time.

- Grows and shrinks automatically; pay per GB used.
- Storage classes: Standard, Infrequent Access, Archive (lifecycle moves files to cheaper classes).

| | EBS | EFS |
|-|-----|-----|
| Attached to | 1 instance, 1 AZ | many instances, many AZs |
| Size | I pick it | automatic |
| Cost | cheaper per GB | more per GB |
| Use | OS disk, a database | shared content: uploads, config, home folders |

---

## S3 (Simple Storage Service)

**S3** = object storage: unlimited files (**objects**) in containers (**buckets**), reached by URL or API.

| Term | Meaning |
|------|---------|
| **Bucket** | a container for objects, in one region. The name must be unique |
| **Object** | a file + its metadata, up to 5 TB |
| **Key** | the object's full name: `logs/2026/app.log` (folders are just part of the name) |

**Durability: 99.999999999% (11 nines)**: data is copied across at least 3 AZs (except One Zone classes).
Reads after a write are **strongly consistent**: I get the new version right away.

**Storage classes** (cheaper storage = slower or costlier to read back):

| Class | Use |
|-------|-----|
| **Standard** | frequently used data (default) |
| **Intelligent-Tiering** | unknown or changing usage: AWS moves objects automatically |
| **Standard-IA** | used less than once a month, needed fast |
| **One Zone-IA** | like IA but in 1 AZ only: re-creatable data |
| **Glacier Instant Retrieval** | archive, read about once a quarter, in milliseconds |
| **Glacier Flexible Retrieval** | archive, minutes to hours to read |
| **Glacier Deep Archive** | cheapest, 12+ hours to read, kept for years |

**Main features:**

| Feature | What it does |
|---------|--------------|
| **Versioning** | keeps every version; a delete only adds a "delete marker", so I can recover |
| **Lifecycle rules** | move objects to cheaper classes or delete them after N days |
| **Encryption** | every new object is encrypted (SSE-S3 by default); SSE-KMS for my own keys |
| **Block Public Access** | on by default for new buckets; stops anything going public by mistake |
| **Bucket policy** | JSON rules on the bucket: who can do what |
| **Pre-signed URL** | a temporary link to one private object |
| **Replication** | copy objects to another bucket / region automatically |
| **Static website hosting** | serve HTML/CSS/JS directly from a bucket (often with CloudFront in front) |

**Common DevOps uses:** Terraform state, build artifacts, logs, backups, static websites.

## Interview one-liners

- **EBS** = block disk for one instance in one AZ; **EFS** = shared NFS across AZs; **S3** = object storage by URL.
- **gp3** is the default EBS type; snapshots are incremental and can restore in any AZ.
- **Instance store** is lost on stop.
- **S3**: 11 nines durability, versioning, lifecycle rules, Block Public Access on by default.
- **Glacier Deep Archive** = cheapest, slowest to restore.
