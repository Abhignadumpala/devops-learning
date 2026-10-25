# 05. EC2, AMIs, Packer and EC2 Cost Optimization

[← AWS notes](README.md)

## EC2 (Elastic Compute Cloud)

**EC2** = a virtual server in AWS. I choose the CPU, RAM, OS and disk, and pay while it runs.

**What I choose when launching:**

| Choice | Meaning | Example |
|--------|---------|---------|
| **AMI** | the image: OS + software to start from | Amazon Linux 2023, RHEL 9 |
| **Instance type** | CPU + RAM size | `t3.micro` (2 vCPU, 1 GB) |
| **Key pair** | SSH key to log in | `devops-key.pem` |
| **VPC + subnet** | which network and AZ | public subnet in `us-east-1a` |
| **Security group** | firewall | 22 from my IP, 80 from anywhere |
| **Storage** | root EBS volume | 20 GB `gp3` |
| **IAM role** | permissions for apps on it | read S3 |
| **User data** | a script that runs **once at first boot** | install nginx |

## Instance types

Name format: `t3.micro` = **family** `t` + **generation** `3` + **size** `micro`.

| Family | Good for | Example |
|--------|----------|---------|
| **t** (burstable) | small, low-average-CPU apps, dev/test | `t3.micro` |
| **m** (general purpose) | balanced CPU/RAM, most apps | `m7i.large` |
| **c** (compute) | CPU-heavy: builds, batch | `c7i.xlarge` |
| **r** (memory) | RAM-heavy: caches, databases | `r7i.large` |
| **g / p** (GPU) | ML, graphics | `g5.xlarge` |

- A letter after the number = the CPU type: `g` = AWS Graviton (ARM, cheaper), `i` = Intel, `a` = AMD.
- **Burstable (t)**: earns CPU credits while idle, spends them when busy.

## Instance lifecycle

| State | Billed for compute? | Notes |
|-------|---------------------|-------|
| `pending` → `running` | yes, while running | |
| `stopped` | **no** (EBS disk still billed) | public IP is lost; private IP stays |
| `terminated` | no | deleted; root EBS deleted by default |

**Reboot** keeps the same public IP. **Stop/start** gives a new public IP (unless it's an Elastic IP).

---

## AMI (Amazon Machine Image)

**AMI** = a template for an instance: OS + installed software + settings. Launch 10 instances from one AMI → 10 identical servers.

- AMIs are **per region** (copy to use in another region).
- I can create my own from a configured instance (**golden AMI**: patches, agents, tools already inside → faster, identical servers).

## Packer (HashiCorp)

**Packer** = a tool that **builds AMIs from code**, the same way every time.

```
Packer template (HCL) ──► starts a temporary EC2 ──► runs my scripts / Ansible ──► saves it as an AMI ──► deletes the temp EC2
```

```hcl
source "amazon-ebs" "web" {
  region        = "us-east-1"
  instance_type = "t3.micro"
  source_ami_filter {
    filters     = { name = "al2023-ami-2023.*-x86_64" }
    owners      = ["amazon"]
    most_recent = true
  }
  ssh_username = "ec2-user"
  ami_name     = "web-golden-{{timestamp}}"
}

build {
  sources = ["source.amazon-ebs.web"]

  provisioner "shell" {
    inline = ["sudo dnf install -y nginx", "sudo systemctl enable nginx"]
  }
}
```

| Part | Meaning |
|------|---------|
| `source` | where and how to build (the base AMI, region, size) |
| `build` + `provisioner` | what to install (shell, Ansible…) |
| Commands | `packer init .` → `packer validate .` → `packer build .` |

**Packer vs Terraform:** Packer **builds the image**; Terraform **launches servers** from it.

---

## EC2 cost optimization

**Ways to pay:**

| Option | Discount vs On-Demand | Commitment | Use for |
|--------|-----------------------|------------|---------|
| **On-Demand** | – | none, pay per second | short or unpredictable work |
| **Savings Plans** | up to ~72% | $/hour for 1 or 3 years | steady usage (flexible across types) |
| **Reserved Instances** | up to ~72% | 1 or 3 years, specific type | steady, known servers |
| **Spot** | up to ~90% | none, but AWS can **take it back with a 2-minute warning** | batch, CI runners, anything that can be interrupted |
| **Dedicated Host** | – (costs more) | | licences tied to physical servers, compliance |

**Other ways to save:**

| Method | How |
|--------|-----|
| **Right-sizing** | match the type to real usage (CloudWatch CPU/RAM, **Compute Optimizer** recommendations) |
| **Stop when not used** | dev/test servers off at night and weekends (Instance Scheduler, a cron Lambda) |
| **Auto Scaling** | run only as many servers as the load needs |
| **Graviton** (ARM) | often cheaper for the same performance |
| **Newer generation** | `t3` over `t2`, `m7i` over `m5`: better price/performance |
| **Clean up** | unattached EBS volumes, old snapshots, unused Elastic IPs and public IPv4s |
| **gp3** over gp2 | cheaper per GB, performance set separately |
| **Watch the bill** | AWS **Budgets** alerts, **Cost Explorer**, cost allocation **tags** |

## Interview one-liners

- **EC2** = virtual server; **AMI** = its template; **user data** = script on first boot.
- **Stop** = no compute charge, EBS still billed, public IP changes.
- **Spot** = up to 90% off but can be taken back with 2 minutes' notice.
- **Savings Plans / RIs** = commit 1–3 years for a big discount.
- **Packer** builds AMIs from code; **Terraform** launches instances from them.
