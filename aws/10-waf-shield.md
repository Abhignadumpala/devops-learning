# 10. WAF and Shield: Protecting Web Apps

[← AWS notes](README.md)

## Layers of protection

```
internet ──► Shield (DDoS) ──► WAF (bad web requests) ──► ALB / CloudFront ──► SG ──► app
             L3/L4 floods        L7: SQL injection, bots    L7               L3/L4
```

## AWS WAF (Web Application Firewall)

**WAF** = a **layer 7** firewall that inspects **HTTP/HTTPS requests** and blocks the bad ones before they reach my app.

A security group only sees IPs and ports. WAF reads **inside the request**: URL, headers, query string, body.

**Attach it to:** ALB, CloudFront, API Gateway, AppSync, Cognito user pools (and a few others).

| Piece | Meaning |
|-------|---------|
| **Web ACL** | the main container of rules, attached to a resource |
| **Rule** | a check + an action |
| **Rule group** | a set of rules; AWS **managed rule groups** are ready-made |
| **Action** | Allow, Block, Count (log only, for testing), CAPTCHA / Challenge |

**What it blocks:**

| Threat | Rule |
|--------|------|
| SQL injection (`' OR 1=1 --`) | SQLi rule / managed group |
| Cross-site scripting (`<script>`) | XSS rule / managed group |
| Too many requests from one IP | **rate-based rule** (e.g. > 1,000 per 5 minutes → block) |
| Bad IPs / countries | IP set, geo match |
| Bots | Bot Control managed group |
| Known bad patterns | AWS managed **Core rule set**, Known bad inputs |

**Tip:** start a new rule in **Count** mode, check the logs, then switch to **Block**, so real users don't get blocked by mistake.

## AWS Shield

**Shield** = protection against **DDoS** attacks (floods of traffic meant to take the site down).

| | Shield Standard | Shield Advanced |
|-|-----------------|-----------------|
| Cost | **free, automatic** for everyone | paid monthly |
| Protects against | common layer 3/4 attacks (SYN floods, UDP floods) | bigger and layer 7 attacks, with WAF included |
| Extras | – | 24/7 AWS response team, cost protection for scaling during an attack |

## WAF vs Security group vs NACL vs Shield

| | Works at | Checks | Use |
|-|----------|--------|-----|
| **NACL** | subnet, L3/4 | IP, port; allow + deny | block IP ranges |
| **Security group** | instance, L3/4 | IP/SG, port; allow only | everyday access |
| **WAF** | ALB/CloudFront/API GW, L7 | inside HTTP requests | SQLi, XSS, rate limits, bots |
| **Shield** | AWS edge | traffic floods | DDoS |

## Interview one-liners

- **WAF** = layer 7 firewall for web requests; attaches to ALB, CloudFront, API Gateway.
- **Web ACL** → rules → actions (Allow / Block / Count / CAPTCHA).
- **Rate-based rule** = limit requests per IP.
- **Shield Standard** = free DDoS protection for everyone; **Advanced** = paid, with a response team.
