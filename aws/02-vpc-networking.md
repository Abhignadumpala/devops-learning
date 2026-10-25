# 02. VPC Networking: VPC, Subnets, Route Tables, Gateways, Peering, Flow Logs, Endpoints, Transit Gateway

[← AWS notes](README.md)

## Region and Availability Zone

| | Meaning | Example |
|-|---------|---------|
| **Region** | a geographic area with its own set of AWS data centers | `us-east-1` (N. Virginia) |
| **Availability Zone (AZ)** | one or more separate data centers inside a region, with their own power and network | `us-east-1a`, `us-east-1b` |

Spread servers over **2+ AZs**: if one AZ goes down, the others keep running (**high availability**).

---

## VPC (Virtual Private Cloud)

**VPC** = my own private, isolated network inside AWS, in one region. Like my own office building: I decide the rooms, doors and who can come in.

- Has a **CIDR** range, e.g. `10.0.0.0/16`.
- Every account has a **default VPC** in each region (`172.31.0.0/16`, all subnets public). Good for practice; for real work I create my own.

## Subnets

**Subnet** = a smaller range of the VPC, in **one AZ**. Like a floor in the building.

| | Public subnet | Private subnet |
|-|---------------|----------------|
| Route to the internet | `0.0.0.0/0 → Internet Gateway` | none, or `0.0.0.0/0 → NAT Gateway` (outbound only) |
| Reachable from the internet | yes (if the instance has a public IP) | **no** |
| Put here | load balancers, bastion host, NAT gateway | app servers, databases |

> A subnet is "public" **only because of its route table**. There's no public/private switch on the subnet itself.

## Route tables

**Route table** = the list of rules that says where traffic goes. Every subnet uses one.

| Destination | Target | Meaning |
|-------------|--------|---------|
| `10.0.0.0/16` | `local` | stay inside the VPC (always there, can't delete) |
| `0.0.0.0/0` | `igw-xxx` | everything else → internet gateway (public subnet) |
| `0.0.0.0/0` | `nat-xxx` | everything else → NAT gateway (private subnet) |

The **most specific** route wins (`/24` beats `/16` beats `/0`).

## Internet Gateway (IGW)

**IGW** = the door between the VPC and the internet. One per VPC. Traffic goes **both ways**. Free. Needs a route table entry pointing to it.

## NAT Gateway

**NAT Gateway** = lets servers in a **private** subnet go **out** to the internet (to download updates, call APIs), while nobody from the internet can come **in**.

```
private server ──► NAT Gateway (in a public subnet) ──► IGW ──► internet
internet ──✖──► private server       (blocked: no way in)
```

- Lives in a **public subnet**, needs an **Elastic IP**.
- Paid per hour + per GB. One per AZ for high availability.

| | IGW | NAT Gateway |
|-|-----|-------------|
| Direction | in **and** out | **out only** |
| Used by | public subnets | private subnets |
| Cost | free | paid |

## Bastion host (jump server)

A small server in a public subnet that I SSH into first, then SSH from it to private servers. Today **AWS Systems Manager Session Manager** is often used instead: no open port 22 needed.

---

## VPC Peering

**VPC peering** = a private connection between **2 VPCs** (same or different account or region), so their servers talk using private IPs.

```
VPC-A 10.0.0.0/16  ◄──── peering ────►  VPC-B 10.1.0.0/16
```

| Rule | Meaning |
|------|---------|
| CIDRs must **not overlap** | `10.0.0.0/16` and `10.0.0.0/16` can't peer |
| **Not transitive** | A↔B and B↔C does **not** give A↔C. Need A↔C too |
| Routes on **both** sides | A's route table: `10.1.0.0/16 → pcx-xxx`, and B's back |
| Security groups must allow it | like any other traffic |

Good for a few VPCs. Many VPCs → too many connections → use a Transit Gateway.

## Transit Gateway

**Transit Gateway** = a central **hub** that connects many VPCs and on-premises networks. Each VPC connects once, to the hub.

```
        VPC-A   VPC-B
           \     /
    VPC-C ── TGW ── VPC-D
               |
         office network (VPN / Direct Connect)
```

| | VPC Peering | Transit Gateway |
|-|-------------|-----------------|
| Shape | point-to-point (mesh) | hub and spoke |
| Transitive | no | **yes** |
| 10 VPCs need | up to 45 connections | 10 attachments |
| Cost | data transfer only | per attachment per hour + per GB |

---

## VPC Flow Logs

**Flow logs** = a record of the IP traffic going in and out of network interfaces: source, destination, port, protocol, and **ACCEPT** or **REJECT**.

- Can be turned on for a **VPC**, a **subnet** or one **network interface**.
- Sent to **CloudWatch Logs**, **S3** or **Data Firehose**.
- Records **metadata only**, not the content of the traffic.

**Use for:** "why can't server A reach server B?". A `REJECT` line points to a security group or NACL blocking it. Also security audits.

```
2 123456789012 eni-0abc 10.0.1.5 10.0.2.9 49152 3306 6 10 840 1700000000 1700000060 REJECT OK
            source IP ─┘   dest IP ─┘    dest port 3306 ─┘   (MySQL blocked) ─┘
```

---

## VPC Endpoints

**VPC endpoint** = reach AWS services (S3, DynamoDB, SSM…) **privately**, without going through the internet, an IGW or a NAT gateway.

| | Gateway endpoint | Interface endpoint (PrivateLink) |
|-|------------------|----------------------------------|
| Services | **S3 and DynamoDB only** | most AWS services (SSM, ECR, Secrets Manager…) |
| How | a route in the route table | a network interface (private IP) in my subnet |
| Cost | **free** | per hour + per GB |

**Why:** a private server downloading from S3 through a NAT gateway pays NAT data charges. A gateway endpoint makes it free and keeps traffic inside AWS.

---

## Full picture

```
                         Internet
                            │
                      Internet Gateway
                            │
 VPC 10.0.0.0/16 ───────────┼──────────────────────────────
 │  Public subnet 10.0.1.0/24 (AZ-a)                        │
 │    Load balancer   NAT Gateway   Bastion                 │
 │         │               ▲                                │
 │  Private subnet 10.0.2.0/24 (AZ-a)                       │
 │    App servers ─────────┘ (outbound only)                │
 │  Private subnet 10.0.3.0/24 (AZ-a)                       │
 │    Database                                              │
 │    S3 gateway endpoint → S3 privately                    │
 ───────────────────────────────────────────────────────────
```

## Interview one-liners

- **VPC** = my private network in one region; **subnet** = a piece of it in one AZ.
- **Public subnet** = route table has `0.0.0.0/0 → IGW`.
- **NAT Gateway** = private servers go out, nothing comes in.
- **Peering** is not transitive; **Transit Gateway** is.
- **Flow logs** show ACCEPT/REJECT traffic metadata, for debugging and audits.
- **Gateway endpoint** (S3, DynamoDB) is free; **interface endpoint** costs per hour.
