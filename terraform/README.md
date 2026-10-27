# Terraform: Basics and Theory

What Terraform is, how it works, and the core building blocks, with short examples.
**AWS resource creation code** (VPC, subnets, internet gateway, route table, security group, EC2, S3, IAM, one file each): [aws-resource-code/](aws-resource-code/)
Full notes and labs: [terraform-notes-kodekloud](https://github.com/Abhignadumpala/terraform-notes-kodekloud)

---

## Table of Contents

1. [Infrastructure as Code (IaC)](#1-infrastructure-as-code-iac)
2. [Types of IaC tools](#2-types-of-iac-tools)
3. [Why Terraform](#3-why-terraform)
4. [HCL: the block shape](#4-hcl-the-block-shape)
5. [Core workflow](#5-core-workflow)
6. [Providers](#6-providers)
7. [Resources, attributes and dependencies](#7-resources-attributes-and-dependencies)
8. [Variables and outputs](#8-variables-and-outputs)
9. [Data sources](#9-data-sources)
10. [State](#10-state)
11. [Mutable vs immutable](#11-mutable-vs-immutable)
12. [Lifecycle rules](#12-lifecycle-rules)
13. [count and for_each](#13-count-and-for_each)
14. [Modules](#14-modules)
15. [Files in a Terraform project](#15-files-in-a-terraform-project)
16. [AWS resource code](aws-resource-code/)

---

## 1. Infrastructure as Code (IaC)

**IaC** = creating servers, networks and databases by writing **code**, not by clicking in the console.

| Clicking in the console | IaC |
|-------------------------|-----|
| slow, one by one | many resources in one run |
| easy to make mistakes | same result every time |
| no record of what was done | the code **is** the record, kept in Git |
| hard to repeat for dev / test / prod | same code, different values |

---

## 2. Types of IaC tools

| Type | Job | Tools |
|------|-----|-------|
| **Configuration management** | install and configure **software** on servers that already exist | Ansible, Puppet, Chef |
| **Server templating** | build a ready-made server **image** (AMI, Docker image) | Packer, Docker |
| **Provisioning** | **create** the infrastructure: VPC, EC2, S3, DNS | **Terraform**, CloudFormation |

> Terraform creates the server. Ansible configures what runs inside it.

---

## 3. Why Terraform

- Works with **many providers**: AWS, Azure, GCP, Kubernetes, GitHub… one tool, one language.
- **Declarative**: I write **what** I want (the end result); Terraform works out **how** and in which order.
- **Plan before apply**: I see every change before it happens.
- **State**: remembers what it created, so it only changes what's different.
- Free and open source CLI (HCP Terraform is the paid hosted version).

| Declarative (Terraform) | Imperative (shell script) |
|-------------------------|---------------------------|
| "I want 1 EC2 instance" | "run this command, wait, check, then run this" |
| run twice → still 1 instance | run twice → 2 instances, unless I write checks |

---

## 4. HCL: the block shape

Terraform code is written in **HCL** (HashiCorp Configuration Language) in `.tf` files.

```hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  tags = {
    Name = "web-server"
  }
}
```

| Part | Example | Meaning |
|------|---------|---------|
| block type | `resource` | what kind of block |
| resource type | `aws_instance` | provider (`aws`) + thing (`instance`) |
| local name | `web` | my name for it, **inside Terraform only** |
| arguments | `instance_type = "t3.micro"` | settings |

---

## 5. Core workflow

```
write .tf → terraform init → terraform plan → terraform apply → (terraform destroy)
```

| Command | What it does |
|---------|--------------|
| `terraform init` | downloads the providers into `.terraform/`, creates `.terraform.lock.hcl` |
| `terraform fmt` | formats the code neatly |
| `terraform validate` | checks the syntax |
| `terraform plan` | preview: `+` create, `~` change in place, `-` destroy, `-/+` replace. **Changes nothing** |
| `terraform apply` | makes the changes (asks `yes`) |
| `terraform destroy` | deletes everything this code created |
| `terraform output` | shows output values |
| `terraform state list` | lists what's in the state |

---

## 6. Providers

A **provider** = a plugin that lets Terraform talk to one platform's API.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```

- `source` = where to download it (Terraform Registry).
- `version = "~> 6.0"` = any 6.x, never 7.0. The exact version picked is saved in `.terraform.lock.hcl` (commit this file).
- Credentials come from `aws configure` (never write keys in `.tf` files).

---

## 7. Resources, attributes and dependencies

Each resource **exports attributes** after it's created (id, IP, ARN). Other resources use them:

```hcl
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id        # reference: <type>.<name>.<attribute>
  cidr_block = "10.0.1.0/24"
}
```

| Dependency | How | Example |
|------------|-----|---------|
| **Implicit** | a reference; Terraform sees it and creates the VPC first | `aws_vpc.main.id` |
| **Explicit** | `depends_on`, when there's no reference but order still matters | `depends_on = [aws_iam_role_policy.x]` |

Resources with no dependency between them are created **in parallel**.

---

## 8. Variables and outputs

**Input variables:** values I can change without editing the code.

```hcl
variable "instance_type" {
  type        = string
  default     = "t3.micro"
  description = "EC2 size"
}

resource "aws_instance" "web" {
  instance_type = var.instance_type
}
```

Ways to set a value, **lowest to highest priority**:

| # | Way |
|---|-----|
| 1 | `default` in the variable block |
| 2 | environment variable `TF_VAR_instance_type` |
| 3 | `terraform.tfvars` file |
| 4 | `*.auto.tfvars` files |
| 5 | `-var` / `-var-file` on the command line (wins) |

No value anywhere → Terraform asks for it.

**Outputs:** values printed after `apply` (and usable by other code).
```hcl
output "public_ip" {
  value = aws_instance.web.public_ip
}
```

**Locals:** a value calculated once and reused inside the code: `locals { name = "${var.env}-web" }` → `local.name`.

---

## 9. Data sources

A **data source** **reads** something that already exists. It creates nothing.

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}
```

Used as `data.aws_ami.amazon_linux.id`, so I never hard-code an AMI ID (IDs differ per region and change).

| `resource` | `data` |
|------------|--------|
| creates and manages | only reads |

---

## 10. State

**State** (`terraform.tfstate`) = Terraform's record of what it created.

| Why it exists | Meaning |
|---------------|---------|
| maps code to real things | `aws_instance.web` = instance `i-0abc…` |
| knows dependencies | the right order for create **and** destroy |
| no duplicates | run apply twice → nothing new is created |
| speed | doesn't need to ask AWS about everything every time |

| Rules | Why |
|-------|-----|
| **never edit it by hand** | use `terraform state` commands |
| **never commit it to Git** | it can contain passwords and keys |
| keep it **remote** for teams (e.g. S3) | everyone uses one copy |
| **lock** it | two people can't apply at the same time |

**Remote state in S3 with locking:**
```hcl
terraform {
  backend "s3" {
    bucket       = "my-tf-state-bucket"
    key          = "app/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true      # S3 native locking, no DynamoDB table needed
    encrypt      = true
  }
}
```

**Drift** = someone changed the resource outside Terraform (in the console). `terraform plan` shows it; `apply` puts it back to match the code.

---

## 11. Mutable vs immutable

| | Mutable | Immutable |
|-|---------|-----------|
| Change | update the **same** server in place | **replace** it with a new one |
| Risk | servers slowly differ from each other (config drift) | every server is the same, clean build |

Terraform is **immutable for most changes**: changing an argument that can't be updated (e.g. the `ami`) shows `-/+` in the plan = destroy and recreate. Some changes (e.g. tags) are updated in place (`~`). The plan always tells me which.

---

## 12. Lifecycle rules

```hcl
resource "aws_instance" "web" {
  # ...

  lifecycle {
    create_before_destroy = true    # new one first, then delete the old (less downtime)
    prevent_destroy       = false   # true = Terraform refuses to destroy it (protect a database)
    ignore_changes        = [tags]  # don't undo changes made outside Terraform to these
  }
}
```

---

## 13. count and for_each

Create many copies from one block:

```hcl
resource "aws_instance" "web" {
  count         = 3                             # web[0], web[1], web[2]
  instance_type = "t3.micro"
  # ...
}

resource "aws_iam_user" "team" {
  for_each = toset(["ramesh", "suresh"])        # team["ramesh"], team["suresh"]
  name     = each.value
}
```

| | `count` | `for_each` |
|-|---------|------------|
| Items named by | number (index) | key (name) |
| Remove one from the middle | others shift index → may be **recreated** | only that one is removed |
| Use for | identical copies | items with their own names/settings |

---

## 14. Modules

A **module** = a folder of `.tf` files I can reuse, like a function.

```hcl
module "vpc" {
  source     = "./modules/vpc"
  cidr_block = "10.0.0.0/16"
}
```

Same module, different values → dev, staging and prod built the same way.

---

## 15. Files in a Terraform project

| File | Holds | In Git? |
|------|-------|---------|
| `provider.tf` | `terraform {}` + `provider` blocks | ✅ |
| `main.tf` (or one file per resource) | resources | ✅ |
| `variables.tf` | variable blocks | ✅ |
| `outputs.tf` | output blocks | ✅ |
| `terraform.tfvars` | variable values | ✅ (if no secrets) |
| `.terraform.lock.hcl` | exact provider versions | ✅ |
| `.terraform/` | downloaded providers | ❌ |
| `terraform.tfstate` | state | ❌ (keep remote) |

Terraform reads **all** `.tf` files in the folder together; file names are only for me.

---

## Quick revision

What I learned in this class:

- **IaC** = infrastructure as code: repeatable, reviewable, kept in Git.
- **Terraform provisions** (creates VPC, EC2, S3); Ansible configures; Packer builds images.
- **Declarative**: I write the end result; Terraform works out the steps and order.
- **Workflow**: `init` → `fmt` → `validate` → `plan` → `apply` → `destroy`.
- **Provider** = plugin for one platform's API; versions locked in `.terraform.lock.hcl` (commit it).
- **References** (`aws_vpc.main.id`) create implicit dependencies; `depends_on` for explicit ones.
- **Variables** (lowest → highest): default → `TF_VAR_` → `terraform.tfvars` → `*.auto.tfvars` → `-var`. **Outputs** print values; **locals** reuse values.
- **Data source** reads something that exists (latest AMI); **resource** creates it.
- **State** maps code to real resources: never edit by hand, never commit, keep remote in S3 with `use_lockfile = true`.
- **Drift** = changed outside Terraform; `plan` shows it, `apply` fixes it.
- **`-/+`** in the plan = replace (immutable); **`~`** = update in place.
- **Lifecycle**: `create_before_destroy`, `prevent_destroy`, `ignore_changes`.
- **`count`** for identical copies, **`for_each`** for named items. **Modules** = reusable folders.

---

Interview questions: [terraform-interview-questions.md](terraform-interview-questions.md)
