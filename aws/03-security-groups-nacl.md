# 03. Security Groups and NACLs

[← AWS notes](README.md)

AWS has 2 firewalls. Traffic must pass **both**:

```
internet ──► [ NACL: subnet's gate ] ──► [ Security group: instance's door ] ──► EC2
```

## Security Group (SG)

**Security group** = a firewall around an **instance** (really, around its network interface).

| Point | Meaning |
|-------|---------|
| **Allow rules only** | there are no "deny" rules; anything not allowed is blocked |
| **Stateful** | if a request is allowed **in**, its reply goes **out** automatically (and the other way round) |
| Default | **inbound: nothing allowed**, **outbound: everything allowed** |
| Source can be | an IP / CIDR (`1.2.3.4/32`) **or another security group** |
| Applies to | instances, load balancers, RDS, etc. (one resource can have up to 5 SGs) |

**Source = another SG** (the best practice between servers):
```
roboshop-mongodb SG:  inbound 27017 from roboshop-catalogue SG
→ any instance with the catalogue SG can connect, whatever its IP is
```
If the server is recreated with a new IP, the rule still works.

## NACL (Network Access Control List)

**NACL** = a firewall at the **subnet** level. Every instance in the subnet is covered.

| Point | Meaning |
|-------|---------|
| **Allow and deny rules** | can block a specific IP (an SG can't) |
| **Stateless** | the reply is **not** allowed automatically: I need rules both ways, including **ephemeral ports** (1024–65535) for replies |
| **Numbered rules** | checked from lowest number up; **first match wins** |
| Default NACL | allows everything in and out |
| A new custom NACL | denies everything until I add rules |

```
Rule #   Type    Port   Source          Allow/Deny
100      HTTP    80     0.0.0.0/0       ALLOW
110      SSH     22     203.0.113.5/32  DENY     ← block one bad IP
*        ALL     ALL    0.0.0.0/0       DENY     ← final catch-all
```

## Security group vs NACL

| | Security group | NACL |
|-|----------------|------|
| Level | instance (network interface) | subnet |
| Rules | allow only | allow **and** deny |
| State | **stateful** (replies automatic) | **stateless** (replies need rules) |
| Rule order | all rules checked | by number, first match wins |
| Default | in: none, out: all | default NACL: all allowed |
| Use for | everyday access control | extra subnet-wide layer, blocking specific IPs |

## Stateful vs stateless, simply

```
Client ──request──► port 80 on server
Client ◄──reply──── from port 80 to client's random port (e.g. 51234)

Security group: allowed the request in → reply goes out automatically ✅
NACL:           needs an OUTBOUND rule for ports 1024–65535 too, or the reply is dropped ❌
```

## Debugging

| Symptom | Likely |
|---------|--------|
| `telnet` / `curl` **times out** | SG or NACL is blocking |
| **connection refused** | reached the server; the service isn't listening |
| Flow log shows `REJECT` | SG or NACL dropped it |

## Interview one-liners

- **SG** = instance-level, stateful, allow-only. **NACL** = subnet-level, stateless, allow + deny, numbered rules.
- To **block one IP**, use a NACL (SGs can't deny).
- **Source = another SG** keeps rules working when IPs change.
- NACL needs **ephemeral ports** (1024–65535) open for replies.
