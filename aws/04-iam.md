# 04. IAM: Identity and Access Management

[← AWS notes](README.md)

**IAM** = who can log in to my AWS account (**authentication**) and what they can do (**authorization**). It's **global** (not per region) and free.

## The pieces

| Piece | What it is | Example |
|-------|------------|---------|
| **Root user** | the email that created the account; can do **everything** | used only for billing and account settings |
| **User** | one person or app with long-term credentials | `ramesh` |
| **Group** | a set of users; permissions given once to the group | `developers` |
| **Role** | permissions that someone or something **takes on temporarily**; no password | an EC2 instance reading S3 |
| **Policy** | a JSON document that says what is allowed or denied | `AmazonS3ReadOnlyAccess` |

```
Policy ──attached to──► Group ◄──member── User
Policy ──attached to──► Role  ◄──assumed by── EC2 / Lambda / another account
```

## Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"]
    }
  ]
}
```

| Field | Meaning |
|-------|---------|
| `Effect` | `Allow` or `Deny` |
| `Action` | which API calls (`s3:GetObject`) |
| `Resource` | on which thing (an **ARN** = AWS's unique name for a resource) |
| `Condition` (optional) | only when… (e.g. from this IP, with MFA) |

**How AWS decides:**
1. Everything is **denied by default**.
2. An `Allow` in any attached policy allows it.
3. An explicit **`Deny` always wins** over any allow.

| Policy type | Meaning |
|-------------|---------|
| AWS managed | ready-made by AWS (`ReadOnlyAccess`) |
| Customer managed | written by me, reusable |
| Inline | written directly into one user/role; deleted with it |
| Resource-based | attached to the resource itself, e.g. an **S3 bucket policy** |

## Roles: why not access keys on servers?

| Access keys in a file on EC2 | IAM role on EC2 |
|------------------------------|-----------------|
| long-term, can leak (Git, logs) | **temporary** credentials, rotated automatically |
| I must rotate them myself | nothing to store or rotate |

An EC2 instance gets a role through an **instance profile**. Apps and the AWS CLI on it pick up the credentials automatically.

**Other role uses:** a Lambda function's permissions, letting another AWS account in (cross-account), CI/CD (GitHub Actions) via **OIDC** without stored keys.

## Best practices

1. **Lock away the root user**: turn on MFA, don't create access keys for it, don't use it day to day.
2. **MFA** for every human user.
3. **Least privilege**: give only the permissions needed, nothing more.
4. Permissions on **groups**, not on individual users.
5. **Roles** for apps and servers, never hard-coded access keys.
6. People sign in through **IAM Identity Center** (single sign-on) where possible.
7. Check unused permissions and old keys regularly (**IAM Access Analyzer**, credential report).

## Interview one-liners

- **User** = a person with long-term credentials; **role** = temporary permissions, no password.
- **Explicit Deny always wins**; everything is denied by default.
- EC2 gets AWS access through an **IAM role** (instance profile), never stored keys.
- **Least privilege** = only what's needed.
- IAM is **global**, not per region.
