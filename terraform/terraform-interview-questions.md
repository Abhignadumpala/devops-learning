# Terraform: Interview Questions

[← Back to Terraform notes](README.md)

**1. What is Terraform?**
An Infrastructure as Code tool. I describe infrastructure in `.tf` files, and Terraform creates, changes and deletes it through provider APIs.

**2. Terraform vs Ansible?**
Terraform **provisions** infrastructure (VPC, EC2, S3). Ansible **configures** software on servers that already exist.

**3. Declarative vs imperative?**
Declarative: I write the end result and Terraform works out the steps. Imperative (shell script): I write every step myself.

**4. Explain the core workflow.**
`init` downloads providers, `plan` previews changes, `apply` makes them, `destroy` deletes everything.

**5. What is a provider?**
A plugin that talks to one platform's API (AWS, Azure, Kubernetes). Declared in `required_providers`, downloaded by `init`.

**6. What is `.terraform.lock.hcl`?**
It records the exact provider versions and checksums, so everyone uses the same versions. Commit it to Git.

**7. What is the state file and why does it matter?**
Terraform's record of what it created. It maps my code to real resource IDs, tracks dependencies and stops duplicates.

**8. Why not commit `terraform.tfstate` to Git?**
It can hold secrets, and two people with different copies would overwrite each other. Keep it in a remote backend like S3, with locking.

**9. What is state locking?**
Only one `apply` can run at a time on the same state. With S3: `use_lockfile = true`.

**10. What is drift?**
A resource changed outside Terraform (e.g. in the console). `plan` shows the difference; `apply` brings it back to match the code.

**11. Implicit vs explicit dependency?**
Implicit: a reference like `aws_vpc.main.id`, so Terraform orders it automatically. Explicit: `depends_on`, when there's no reference but order matters.

**12. Resource vs data source?**
`resource` creates and manages. `data` only reads something that already exists, e.g. the latest AMI.

**13. Ways to pass variable values, and which wins?**
`default` < `TF_VAR_` env var < `terraform.tfvars` < `*.auto.tfvars` < `-var` / `-var-file` (highest).

**14. What does `-/+` mean in a plan?**
The resource will be destroyed and recreated (replace), because the changed argument can't be updated in place (e.g. `ami`).

**15. `count` vs `for_each`?**
`count` names copies by number; removing one from the middle shifts the rest. `for_each` names them by key, so only the removed one is affected.

**16. What are lifecycle rules?**
`create_before_destroy` (new first, less downtime), `prevent_destroy` (protect it), `ignore_changes` (don't undo outside changes to listed arguments).

**17. What is a module?**
A reusable folder of `.tf` files. Call it with different values to build dev, staging and prod the same way.

**18. How do you avoid hard-coding an AMI ID?**
A `data "aws_ami"` lookup with filters and `most_recent = true`.

**19. Where do AWS credentials go?**
Not in `.tf` files. `aws configure`, environment variables, or an IAM role on the machine running Terraform.

**20. What does `terraform plan` change?**
Nothing. It only shows what `apply` would do.
