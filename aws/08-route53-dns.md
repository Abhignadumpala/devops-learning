# 08. Route 53 and DNS

[← AWS notes](README.md)

## DNS in one line

**DNS** = the internet's phone book: turns a name (`abhignadevops.store`) into an IP (`34.239.251.2`).

```
browser: "abhignadevops.store?"
   → resolver (ISP / 8.8.8.8)
      → root servers: "ask the .store servers"
         → .store TLD servers: "ask Route 53's name servers"
            → Route 53: "34.239.251.2"
browser connects to 34.239.251.2
```

| Term | Meaning |
|------|---------|
| **Domain registrar** | where I buy the domain (Route 53, GoDaddy, Hostinger) |
| **Hosted zone** | the container of DNS records for one domain in Route 53 |
| **Name servers (NS)** | the 4 Route 53 servers that answer for my domain. Set them at the registrar |
| **TTL** | how many seconds others cache the answer. Low = changes spread fast |

> Bought the domain somewhere else? Copy Route 53's **4 NS values** into the registrar. Until then, lookups fail with `NXDOMAIN`.

## Public vs private hosted zone

| | Public | Private |
|-|--------|---------|
| Answers | anyone on the internet | only inside the VPCs I attach |
| Use | website, API | internal names: `mongodb.internal` |

## Record types

| Type | Points a name to | Example |
|------|------------------|---------|
| **A** | an IPv4 address | `mongodb.abhignadevops.store → 172.31.13.80` |
| **AAAA** | an IPv6 address | |
| **CNAME** | another name | `www → abhignadevops.store`. **Not allowed on the root domain** |
| **Alias** (Route 53 only) | an AWS resource: ALB, CloudFront, S3 website | `abhignadevops.store → my-alb-123.elb.amazonaws.com`. **Works on the root domain**, free queries |
| **MX** | mail servers | |
| **TXT** | text: domain verification, SPF | |
| **NS** | the zone's name servers | |

**CNAME vs Alias:** both point a name to another name. Alias works on the root domain (`example.com`), points only to AWS resources, and its queries are free. Use Alias for ALBs.

## Routing policies

| Policy | Answers with | Use |
|--------|--------------|-----|
| **Simple** | one value (or a few, randomly) | one server |
| **Weighted** | by % (e.g. 90% v1, 10% v2) | canary / blue-green release |
| **Latency** | the region with the lowest delay for that user | multi-region apps |
| **Failover** | primary; secondary only if the primary's health check fails | disaster recovery |
| **Geolocation** | by the user's country/continent | content or legal rules per country |
| **Geoproximity** | by distance, with a "bias" to shift traffic | moving load between regions |
| **Multivalue answer** | up to 8 healthy IPs | simple spreading with health checks |
| **IP-based** | by the user's IP range | send ISP/office ranges to a chosen endpoint |

**Health checks:** Route 53 checks an endpoint (HTTP/HTTPS/TCP) and stops answering with it if unhealthy. Needed for failover.

## In my RoboShop build

| Record | Type | Points to |
|--------|------|-----------|
| `abhignadevops.store` | A | frontend **public** IP |
| `mongodb.abhignadevops.store`, `redis…`, `catalogue…` | A | each server's **private** IP |

Config files use the **names**, so a recreated server only needs its record updated (UPSERT).

## Interview one-liners

- **Hosted zone** = DNS records for one domain; **NS** records must be set at the registrar.
- **A** = name → IP; **CNAME** = name → name (not on root); **Alias** = name → AWS resource (works on root).
- **TTL** = cache time; lower it before a change.
- **Weighted** = canary releases; **failover** = DR with health checks; **latency** = nearest region.
