# AWS: Interview Questions

[← AWS notes](README.md)

## Network

**1. Region vs Availability Zone?**
A region is a geographic area (`us-east-1`). An AZ is one or more separate data centers inside it. Spread servers over 2+ AZs for high availability.

**2. How many usable IPs in a `/24` subnet in AWS?**
256 − 5 reserved = **251**.

**3. What makes a subnet public?**
Its route table has `0.0.0.0/0 → Internet Gateway`.

**4. Internet Gateway vs NAT Gateway?**
IGW: two-way internet for public subnets, free. NAT: outbound-only internet for private subnets, paid.

**5. Is VPC peering transitive?**
No. A↔B and B↔C doesn't give A↔C. Use a Transit Gateway for many VPCs.

**6. What are VPC flow logs?**
Records of traffic metadata (source, destination, port, ACCEPT/REJECT) for a VPC, subnet or interface, sent to CloudWatch Logs or S3.

**7. Gateway vs interface endpoint?**
Gateway: S3 and DynamoDB, a route-table entry, free. Interface: most services, a private IP in my subnet, paid per hour.

## Security

**8. Security group vs NACL?**
SG: instance level, stateful, allow-only. NACL: subnet level, stateless, allow + deny, numbered rules.

**9. How do I block one IP address?**
A NACL deny rule (SGs can't deny), or WAF for web traffic.

**10. Why use another SG as the source in a rule?**
IPs change when servers are recreated; "allow from SG X" keeps working.

**11. IAM user vs role?**
User: a person with long-term credentials. Role: temporary permissions that a service or user assumes, no password.

**12. How does an EC2 app get AWS permissions safely?**
An IAM role attached through an instance profile. No access keys stored on the server.

**13. Allow vs explicit Deny?**
Everything is denied by default; Allow grants; an explicit Deny always wins.

**14. WAF vs Shield?**
WAF: layer 7 rules on web requests (SQLi, XSS, rate limits). Shield: DDoS protection (Standard is free).

## Compute

**15. What is an AMI?**
A template of OS + software + settings to launch identical instances. Per region.

**16. What happens on stop vs terminate?**
Stop: no compute charge, EBS kept, public IP changes. Terminate: instance deleted, root volume deleted by default.

**17. EC2 pricing options?**
On-Demand, Savings Plans / Reserved Instances (1–3 years, up to ~72% off), Spot (up to ~90% off, can be interrupted with 2 minutes' notice), Dedicated Hosts.

**18. How do you reduce EC2 cost?**
Right-size, stop dev servers when idle, Auto Scaling, Savings Plans for steady load, Spot for interruptible work, Graviton, clean up unused volumes and IPs.

**19. What is Packer?**
A HashiCorp tool that builds AMIs from code: starts a temp instance, runs scripts, saves an AMI.

**20. What is user data?**
A script that runs once at the instance's first boot, e.g. to install software.

## Storage

**21. EBS vs EFS vs S3?**
EBS: block disk for one instance in one AZ. EFS: shared NFS across many instances and AZs. S3: object storage by URL/API.

**22. Can I attach an EBS volume to an instance in another AZ?**
No. Snapshot it, then create a new volume from the snapshot in the other AZ.

**23. S3 storage classes?**
Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant / Flexible / Deep Archive. Cheaper = slower or costlier to read.

**24. How do you protect S3 data?**
Block Public Access, bucket policies, encryption (on by default), versioning, lifecycle rules, replication.

## Scaling and DNS

**25. ALB vs NLB?**
ALB: layer 7, routes by path/host (HTTP). NLB: layer 4, TCP/UDP, static IPs, extremely high performance.

**26. What does an Auto Scaling Group need?**
A launch template, min/desired/max, subnets in several AZs, and a scaling policy (e.g. target tracking on CPU).

**27. CNAME vs Alias record?**
Both point to another name. Alias works on the root domain, only for AWS resources, with free queries. CNAME can't be used on the root.

**28. Route 53 routing policy for a canary release?**
Weighted (e.g. 90% / 10%). Failover for disaster recovery, latency for multi-region.

## Databases

**29. RDS Multi-AZ vs read replica?**
Multi-AZ: synchronous standby with automatic failover, for availability. Read replica: asynchronous copy that serves reads, for scale.

**30. RDS vs DynamoDB?**
RDS: managed relational (SQL) with tables and joins. DynamoDB: serverless NoSQL key-value, millisecond speed at any scale.
