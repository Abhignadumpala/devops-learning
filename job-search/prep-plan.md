# DevOps Job Prep Plan

Built from `job-postings-2026-09-15.md`. Target: entry-level DevOps/Cloud roles requiring ~1 year of experience (e.g. the SoCode Recruitment posting), while building toward the 3–5 year roles over time.

---

## 1. Where I Stand Right Now

✅ **Done:** Docker fundamentals — built a Node.js HTTP server, containerized it with a Dockerfile, built and ran the image, tested it in a browser, and documented all of it in `docker/README.md` + `docker/docker-interview-questions.md`.

That covers the "Docker/containerization" requirement that appears in **every** posting.

---

## 2. Gap Analysis (what's required vs. what I have)

| Requirement (from postings) | Status |
|---|---|
| Docker / containerization | ✅ Done |
| AWS core services (EC2, S3, VPC, RDS, IAM) | ❌ Not started |
| Terraform / IaC | ❌ Not started |
| CI/CD (GitHub Actions / GitLab CI / Jenkins) | ❌ Not started |
| Kubernetes / EKS | ❌ Not started |
| Python / Bash scripting | ❌ Not started |
| Monitoring (CloudWatch / Prometheus) | ❌ Not started |
| AWS certification | ❌ Not started (required for MagicBeans, a plus everywhere else) |

Everything below "Done" is fair game — this is exactly the roadmap I already sketched at the bottom of the Docker README.

---

## 3. Recommended Order

Picked in the order that (a) matches how often each skill shows up across the postings, and (b) builds naturally on Docker.

### Step 1 — AWS Fundamentals + Cloud Practitioner cert
- Create a free-tier AWS account.
- Learn core services hands-on: EC2, S3, VPC, IAM, RDS basics.
- Study for and take the **AWS Certified Cloud Practitioner** exam — it's the cheapest/fastest AWS cert, explicitly required by MagicBeans, and a credibility boost for every other posting.
- Document each service the same way as the Docker project: what it is, why it's used, a hands-on exercise, then a `*-interview-questions.md`.

### Step 2 — Terraform
- Install Terraform locally, connect it to the AWS free-tier account.
- Rebuild a couple of the AWS resources from Step 1 (an S3 bucket, a VPC, an EC2 instance) as Terraform code instead of clicking through the console.
- Learn: providers, resources, state, `plan`/`apply`/`destroy`, variables, basic modules.
- This directly satisfies "Terraform / IaC," required in every single posting.

### Step 3 — CI/CD
- Push the Docker project (or a new small app) to GitHub.
- Build a GitHub Actions pipeline: build the Docker image, run a basic test, (optionally) push to Docker Hub.
- Learn the same concepts in GitLab CI or Jenkins terms too, since postings mix all three — the underlying ideas (stages, jobs, artifacts, secrets) transfer directly.

### Step 4 — Kubernetes
- Run a local cluster (kind or minikube).
- Deploy the same Node.js app from the Docker project as a Kubernetes Deployment + Service.
- Learn core objects: Deployments, Services, ConfigMaps, Secrets, Ingress, scaling (HPA).
- Once comfortable locally, look at AWS EKS specifically, since that's what most postings actually ask for.

### Step 5 — Scripting (Python/Bash)
- Don't treat this as a separate topic — write small scripts *inside* Steps 1–4 instead of doing everything manually (e.g., a Bash script to tear down AWS resources, a Python script to check container health).
- This is what "automation scripting" means in these job postings — tooling that removes manual steps, not standalone algorithm practice.

### Step 6 — Monitoring/Observability
- Set up basic CloudWatch alarms on the AWS resources from Step 1.
- Try Prometheus + Grafana locally against the Kubernetes deployment from Step 4.

---

## 4. Documentation Habit (keep doing this)

For each topic above, repeat the pattern already used for Docker:
- `<topic>/README.md` — what I built, why, and a line-by-line explanation of the code/config, ending with a short "big ideas" section.
- `<topic>/<topic>-interview-questions.md` — Q&A based on that exact project.
- Commit and push to `devops-learning` as I go — it doubles as portfolio proof for applications.

---

## 5. Applying

- **Apply now, don't wait to "finish" the roadmap:** SoCode Recruitment (1+ yr, remote Portugal, €40–55k) is the best-fit posting today. It says "actively reviewing applicants" despite being posted ~a month ago, so it's still live — apply before doing all 6 steps above.
- Also reasonable now: MagicBeans (contract, entry-level, 1–2 yrs) and Integer Consulting, once the Cloud Practitioner cert is done.
- Treat Altium, emagine (needs French), Adentis (needs 3+ yrs), Conclusion Lifecycle, Opplane, and act digital as **later targets** — they ask for 3–6+ years or a language I don't have yet. Keep them saved for after a year or two of experience.
- Update the resume/LinkedIn to lead with the Docker project (and each new one as it's finished) as concrete proof of hands-on skill, since that's what these entry-level postings are actually screening for.
