# 09. Databases on AWS

[← AWS notes](README.md)

## Self-managed (on EC2) vs managed

In RoboShop I installed MySQL, MongoDB, Redis and RabbitMQ **myself on EC2**. AWS also offers each as a **managed** service.

| Who does it | DB on EC2 | Managed (RDS etc.) |
|-------------|-----------|--------------------|
| Install, patch, upgrade | me | AWS |
| Backups | me (scripts, snapshots) | automatic, point-in-time restore |
| High availability | me (replication setup) | a setting (Multi-AZ) |
| OS access | full (SSH) | none |
| Cost | cheaper on paper | more per hour, much less work |

## SQL vs NoSQL

| | SQL (relational) | NoSQL |
|-|------------------|-------|
| Data shape | tables with fixed columns, relations | documents, key-value, etc.; flexible |
| Scaling | mostly up (bigger server) + read replicas | mostly out (more nodes) |
| Example | orders, payments, users | product catalogues, sessions, carts |
| AWS | **RDS**, **Aurora** | **DynamoDB**, **DocumentDB**, **ElastiCache** |

## RDS (Relational Database Service)

**RDS** = managed SQL databases: **MySQL, PostgreSQL, MariaDB, Oracle, SQL Server** (and Db2).

| Feature | What it gives |
|---------|---------------|
| **Automated backups** | daily snapshot + transaction logs → restore to any second in the retention period (up to 35 days) |
| **Manual snapshots** | kept until I delete them |
| **Multi-AZ** | a standby copy in another AZ, updated synchronously; **automatic failover** in about a minute or two. For **availability**, not for extra reads |
| **Read replicas** | copies (updated asynchronously) that serve **read** traffic; can be in other regions; can be promoted | 
| Storage autoscaling | the disk grows by itself |
| Encryption | with KMS, chosen at creation |

| | Multi-AZ | Read replica |
|-|----------|--------------|
| Purpose | survive an AZ failure | handle more reads |
| Copy | synchronous | asynchronous |
| Serves traffic | no (standby) | yes (reads) |

**Best practice:** put RDS in **private subnets** (a DB subnet group), allow 3306/5432 only from the app's security group, keep the password in **Secrets Manager**.

## Aurora

**Aurora** = AWS's own MySQL- and PostgreSQL-compatible database. Faster, storage auto-grows and is copied 6 times across 3 AZs, up to 15 read replicas, quick failover. **Aurora Serverless v2** scales capacity up and down automatically.

## DynamoDB

**DynamoDB** = fully managed **NoSQL key-value / document** database. Serverless: no servers or instances to choose.

- Single-digit millisecond speed at any scale.
- Each item is found by its **partition key** (+ optional sort key).
- **On-demand** (pay per request) or **provisioned** capacity.
- Extras: global tables (multi-region), TTL, streams, point-in-time recovery.
- DevOps example: the old way of locking Terraform state (Terraform can lock in S3 itself today with `use_lockfile`).

## ElastiCache

**ElastiCache** = managed in-memory cache: **Valkey, Redis OSS, Memcached**. Microsecond reads.

Used for sessions, carts, counters and caching slow database queries, the same job Redis did in my RoboShop build.

## Other managed services matching RoboShop

| RoboShop on EC2 | Managed on AWS |
|-----------------|----------------|
| MySQL | RDS for MySQL / Aurora MySQL |
| MongoDB | **DocumentDB** (MongoDB-compatible) |
| Redis | **ElastiCache** |
| RabbitMQ | **Amazon MQ** (RabbitMQ or ActiveMQ), or **SQS** for simple queues |

## Database configuration checklist (DevOps view)

| Area | What I set up |
|------|---------------|
| Network | private subnets, SG allowing only the app's SG on the DB port |
| Access | app gets its own DB user with only the rights it needs (not root/admin) |
| Secrets | password in Secrets Manager / SSM Parameter Store, never in code |
| Backups | automated backups on, retention set, restore tested |
| Availability | Multi-AZ for production |
| Monitoring | CloudWatch: CPU, free storage, connections, replica lag |
| Data loading | idempotent: check before loading (e.g. count rows first) |

## Interview one-liners

- **RDS** = managed SQL; **Aurora** = AWS's faster MySQL/PostgreSQL-compatible engine.
- **Multi-AZ** = availability (standby, failover); **read replica** = scale reads.
- **DynamoDB** = serverless NoSQL key-value, millisecond speed.
- **ElastiCache** = managed Redis/Valkey/Memcached cache.
- Databases go in **private subnets**; passwords in **Secrets Manager**.
