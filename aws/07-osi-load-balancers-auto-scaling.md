# 07. OSI Layers, Load Balancers and Auto Scaling Groups

[← AWS notes](README.md)

## OSI model: 7 layers

The **OSI model** splits network communication into 7 layers. Each layer has one job. I need it mainly to know "which layer does this tool work at?".

| # | Layer | Job | Examples |
|---|-------|-----|----------|
| 7 | **Application** | what the app speaks | HTTP, HTTPS, DNS, SSH |
| 6 | Presentation | format, encryption | TLS/SSL, JSON, JPEG |
| 5 | Session | open/keep/close a conversation | sessions |
| 4 | **Transport** | ports, reliable or fast delivery | **TCP**, **UDP** |
| 3 | **Network** | IP addresses, routing between networks | **IP**, ICMP (ping), routers |
| 2 | Data link | delivery inside one local network | MAC address, switches |
| 1 | Physical | the cable / signal | cables, Wi-Fi |

**TCP vs UDP:**

| TCP | UDP |
|-----|-----|
| connection first (handshake), checks delivery | no connection, no checks |
| reliable, slower | fast, can lose packets |
| web, SSH, databases | DNS lookups, video calls, gaming |

**Why it matters in AWS:** **ALB = layer 7** (reads HTTP: paths, headers), **NLB = layer 4** (only IP + port), **security groups and NACLs = layers 3–4** (IP + port), **WAF = layer 7** (inspects web requests).

---

## Load balancers (Elastic Load Balancing)

**Load balancer** = one entry point that spreads traffic across many servers, and stops sending to unhealthy ones.

```
                      ┌──► EC2 (AZ-a)  ✅
users ──► Load Balancer ──► EC2 (AZ-b)  ✅
                      └──✖ EC2 (AZ-a)  ❌ failed health check → no traffic
```

**Parts:**

| Part | Meaning |
|------|---------|
| **Listener** | port + protocol it accepts (HTTPS 443) |
| **Rules** (ALB) | where to send each request: by path, host, header |
| **Target group** | the servers (or IPs, Lambdas) that receive traffic |
| **Health check** | e.g. `GET /health` every 30 s; failing targets get no traffic |

**Types:**

| | ALB (Application) | NLB (Network) | GWLB (Gateway) |
|-|-------------------|---------------|----------------|
| Layer | **7** (HTTP/HTTPS) | **4** (TCP/UDP/TLS) | 3 |
| Routes by | path (`/api/*`), host, headers | IP + port | – |
| Speed | fast | **extremely fast**, millions of requests/s | – |
| Static IP | no (use the DNS name) | **yes**, 1 per AZ (Elastic IP possible) | – |
| Use | websites, APIs, microservices | games, IoT, non-HTTP, very high load | sending traffic through firewall appliances |

(The Classic Load Balancer is the old generation; new setups use ALB or NLB.)

**Microservices with one ALB:**
```
ALB rules:  /api/catalogue/* → catalogue target group
            /api/user/*      → user target group
            /*               → frontend target group
```

**Other features:** **SSL termination** (the HTTPS certificate from ACM sits on the load balancer), **sticky sessions** (same user → same server), **cross-zone** load balancing.

---

## Auto Scaling Groups (ASG)

**ASG** = keeps the right number of EC2 instances running: adds them when load goes up, removes them when it goes down, and replaces unhealthy ones.

| Setting | Meaning | Example |
|---------|---------|---------|
| **Launch template** | how to build each instance: AMI, type, SG, user data | golden AMI + `t3.small` |
| **Min** | never fewer than this | 2 |
| **Desired** | how many right now | 2 |
| **Max** | never more than this | 6 |
| Subnets | spread across AZs | 2 private subnets in 2 AZs |

**Scaling policies:**

| Policy | How it works |
|--------|--------------|
| **Target tracking** | "keep average CPU at 50%": adds/removes instances to stay there (easiest, most used) |
| **Step scaling** | CPU > 70% → +2, CPU > 90% → +4 (based on CloudWatch alarms) |
| **Scheduled** | e.g. 6 instances every weekday 9:00, 2 at night |
| **Predictive** | learns daily/weekly patterns and scales **before** the load arrives |

**Health checks:** EC2 status checks by default; with a load balancer, also use the **ELB health check**, so an instance whose app is down gets replaced.

**ALB + ASG together:**
```
users ─► ALB ─► target group ◄── ASG registers/removes instances automatically
                                  (min 2, max 6, across 2 AZs)
```

## Interview one-liners

- **OSI**: L7 application (HTTP), L4 transport (TCP/UDP, ports), L3 network (IP).
- **ALB** = layer 7, routes by path/host; **NLB** = layer 4, static IPs, ultra-fast.
- **Target group + health check** = only healthy servers get traffic.
- **ASG** = min/desired/max from a launch template; replaces unhealthy instances.
- **Target tracking** = "keep CPU at X%", the simplest scaling policy.
