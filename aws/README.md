# AWS Notes: What Each Service Is

AWS services explained in simple language, in the order I'd learn them: network first, then security, servers, storage, scaling, DNS, databases and protection.

| # | Note | What's inside |
|---|------|---------------|
| 1 | [IP addresses and CIDR](01-ip-addressing.md) | public vs private IP, Elastic IP, CIDR maths, 5 reserved IPs per subnet, ports |
| 2 | [VPC networking](02-vpc-networking.md) | Region/AZ, VPC, subnets, route tables, Internet Gateway, NAT Gateway, peering, Transit Gateway, flow logs, VPC endpoints |
| 3 | [Security groups and NACLs](03-security-groups-nacl.md) | stateful vs stateless, allow vs deny, SG as source, ephemeral ports |
| 4 | [IAM](04-iam.md) | root, users, groups, roles, policies, how AWS decides, best practices |
| 5 | [EC2, AMIs, Packer, cost](05-ec2-ami-packer-cost.md) | instance types, lifecycle, AMIs, building AMIs with Packer, pricing options, saving money |
| 6 | [Storage: EBS, EFS, S3](06-storage-ebs-efs-s3.md) | block vs file vs object, EBS types and snapshots, instance store, EFS, S3 classes and features |
| 7 | [OSI, load balancers, Auto Scaling](07-osi-load-balancers-auto-scaling.md) | 7 layers, TCP vs UDP, ALB vs NLB vs GWLB, target groups, ASG and scaling policies |
| 8 | [Route 53 and DNS](08-route53-dns.md) | how DNS works, hosted zones, record types, CNAME vs Alias, routing policies |
| 9 | [Databases](09-databases.md) | SQL vs NoSQL, RDS (Multi-AZ vs read replicas), Aurora, DynamoDB, ElastiCache, DB setup checklist |
| 10 | [WAF and Shield](10-waf-shield.md) | layer 7 protection, web ACLs, rate limits, DDoS protection |
| – | [Interview questions](aws-interview-questions.md) | 30 Q&A across all topics |

## How it all fits together

```
                         Users
                           │
                      Route 53 (DNS)                         08
                           │
                 Shield + WAF (protection)                   10
                           │
 VPC ──────────────────────┼─────────────────────────────    02
 │ Public subnets      Load balancer (ALB)                │  07
 │                         │                              │
 │ Private subnets     Auto Scaling Group of EC2          │  05, 07
 │                     (SGs, IAM role, EBS disks)         │  03, 04, 06
 │                         │                              │
 │ Private subnets     RDS / ElastiCache / DynamoDB       │  09
 ──────────────────────────────────────────────────────────
                     S3 (files, backups, Terraform state)    06
```

**Terraform code for these resources:** [`../terraform/aws-resource-code/`](../terraform/aws-resource-code/)
