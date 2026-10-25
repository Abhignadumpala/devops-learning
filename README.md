# DevOps Learning Log

Building toward job applications — the study order below follows the skills that showed up most in DevOps job postings I've been tracking.

**How this repo works:** each topic gets its own folder with a `README.md` (what I built + line-by-line explanation) and a `<topic>-interview-questions.md` (Q&A based on that exact project). This file tracks progress across all topics and logs what happened each day. A checkbox below means "documented here with proof," not "never touched before."

---

## Checklist

- [x] **Docker** — containerized a Node.js HTTP server, built + ran the image, tested in browser → [`docker/`](docker/)
- [ ] **AWS Fundamentals** — EC2, S3, VPC, IAM, RDS basics + AWS Certified Cloud Practitioner
- [ ] **Terraform** — rebuild AWS fundamentals resources as IaC (providers, resources, state, plan/apply/destroy, variables) → theory: [`terraform/`](terraform/)
- [ ] **CI/CD** — GitHub Actions pipeline for the Docker project (build → test → deploy)
- [ ] **Kubernetes** — local cluster (kind/minikube), deploy the Docker app as Deployment + Service, then AWS EKS
- [ ] **Linux fundamentals** — file system, permissions, process management, shell scripting → theory: [`linux/00-linux-theory/`](linux/00-linux-theory/), [`shell-scripting/`](shell-scripting/)
- [ ] **Git / version control** — branching, merging, PR workflow (beyond basic add/commit/push)
- [ ] **Scripting (Python/Bash)** — folded into the topics above as automation, not a standalone module
- [ ] **Monitoring/Observability** — CloudWatch alarms on AWS resources, Prometheus + Grafana on the Kubernetes deployment
- [ ] **Security/IAM basics** — least-privilege IAM policies, security groups vs NACLs
- [ ] **Capstone project** — one project tying together Terraform + AWS + CI/CD + Kubernetes + monitoring, documented with an interview presentation deck and war stories

Order is based on skill frequency across the job postings I've saved — AWS, Terraform, CI/CD, and Docker showed up in every one.

---

## Day-to-Day Log

Short entries — what I did, what I learned, what's next. Newest first.

### 2026-10-25 — Day 3: Linux, shell scripting and Terraform theory
- Wrote the theory behind the commands in [`linux/00-linux-theory/`](linux/00-linux-theory/): OS and kernel, distros, directory layout, inodes and links, users and permissions, packages, systemd services, processes, ports, troubleshooting order.
- Wrote [`shell-scripting/`](shell-scripting/): every building block (variables, special variables, exit status, conditions, functions, loops, redirections, error handling, idempotency) and a script template, plus 20 Q&A.
- Wrote [`terraform/`](terraform/): IaC, core workflow, providers, resources and dependencies, variables, data sources, state and locking, lifecycle, count vs for_each, modules, plus 20 Q&A.
- **Next:** hands-on proof for each: a small script project and a Terraform AWS build, then tick them off.

### 2026-09-23 — Day 2: Linux commands
- Wrote the Linux commands I use in plain language, split by topic into [`linux/`](linux/): navigation, file CRUD, searching (grep/find), permissions, pipes & redirection, wget vs curl, and a few other useful commands.
- **Next:** add more commands (process management, shell scripting) before ticking off Linux fundamentals.

### 2026-09-15 — Day 1: Docker
- Built a Node.js HTTP server, wrote a Dockerfile, built the image with `docker build`, ran it with `docker run -p 3000:3000`, tested `http://localhost:3000` in the browser.
- Documented everything in [`docker/README.md`](docker/README.md) and wrote 20 Q&A in [`docker/docker-interview-questions.md`](docker/docker-interview-questions.md).
- Saved 9 relevant job postings and worked out a study order from them.
- **Next:** AWS fundamentals — set up a free-tier account, start with EC2/S3/VPC.
