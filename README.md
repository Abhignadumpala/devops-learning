# DevOps Learning Log

I already know the basics of most topics below from self-study, but I never documented any of it publicly — so I had no proof, and explaining it out loud in an interview always felt shakier than it should. This repo fixes both: I re-build each topic as a small hands-on project, document it properly, and write it up like I'd explain it to an interviewer. That process is what builds the confidence, not just the knowing.

Building toward job applications (see `job-search/` for target roles and the study order this checklist follows).

**How this repo works:** each topic gets its own folder with a `README.md` (what I built + line-by-line explanation) and a `<topic>-interview-questions.md` (Q&A based on that exact project). This file tracks progress across all topics and logs what happened each day. A checkbox below means "documented here with proof," not "never touched before."

---

## Checklist

- [x] **Docker** — containerized a Node.js HTTP server, built + ran the image, tested in browser → [`docker/`](docker/)
- [ ] **AWS Fundamentals** — EC2, S3, VPC, IAM, RDS basics + AWS Certified Cloud Practitioner
- [ ] **Terraform** — rebuild AWS fundamentals resources as IaC (providers, resources, state, plan/apply/destroy, variables)
- [ ] **CI/CD** — GitHub Actions pipeline for the Docker project (build → test → deploy)
- [ ] **Kubernetes** — local cluster (kind/minikube), deploy the Docker app as Deployment + Service, then AWS EKS
- [ ] **Linux fundamentals** — file system, permissions, process management, shell scripting
- [ ] **Git / version control** — branching, merging, PR workflow (beyond basic add/commit/push)
- [ ] **Scripting (Python/Bash)** — folded into the topics above as automation, not a standalone module
- [ ] **Monitoring/Observability** — CloudWatch alarms on AWS resources, Prometheus + Grafana on the Kubernetes deployment
- [ ] **Security/IAM basics** — least-privilege IAM policies, security groups vs NACLs
- [ ] **Capstone project** — one project tying together Terraform + AWS + CI/CD + Kubernetes + monitoring, documented with an interview presentation deck and war stories

Order matches the skill-frequency analysis in [`job-search/prep-plan.md`](job-search/prep-plan.md) — AWS, Terraform, CI/CD, and Docker showed up in every job posting saved there.

---

## Day-to-Day Log

Short entries — what I did, what I learned, what's next. Newest first.

### 2026-09-23 — Day 2: Linux commands
- Wrote the Linux commands I use in plain language, split by topic into [`linux/`](linux/): navigation, file CRUD, searching (grep/find), permissions, pipes & redirection, wget vs curl, and a few other useful commands.
- **Next:** add more commands (process management, shell scripting) before ticking off Linux fundamentals.

### 2026-09-15 — Day 1: Docker
- Built a Node.js HTTP server, wrote a Dockerfile, built the image with `docker build`, ran it with `docker run -p 3000:3000`, tested `http://localhost:3000` in the browser.
- Documented everything in [`docker/README.md`](docker/README.md) and wrote 20 Q&A in [`docker/docker-interview-questions.md`](docker/docker-interview-questions.md).
- Saved 9 relevant job postings and a study-order gap analysis in `job-search/`.
- **Next:** AWS fundamentals — set up a free-tier account, start with EC2/S3/VPC.
