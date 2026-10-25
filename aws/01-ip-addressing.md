# 01. IP Addresses and CIDR

[← AWS notes](README.md)

## What is an IP address?

An **IP address** = the address of a device on a network, like a house address. Data is sent to it.

**IPv4** = 4 numbers from 0 to 255, separated by dots: `172.31.13.80`. Each number is 8 bits, so 32 bits in total → about 4.3 billion addresses. Not enough for the world, which is why IPv6 exists (`2001:db8::1`, 128 bits).

## Public vs private IP

| | Public IP | Private IP |
|-|-----------|------------|
| Reachable from | the internet | only inside the network (VPC) |
| Unique | in the whole world | only inside the network |
| Cost in AWS | paid per hour (every public IPv4) | free |
| Example | `34.239.251.2` (RoboShop frontend) | `172.31.13.80` (RoboShop mongodb) |

**Private ranges** (reserved, never on the internet):

| Range | CIDR |
|-------|------|
| `10.0.0.0` – `10.255.255.255` | `10.0.0.0/8` |
| `172.16.0.0` – `172.31.255.255` | `172.16.0.0/12` (AWS default VPC uses `172.31.0.0/16`) |
| `192.168.0.0` – `192.168.255.255` | `192.168.0.0/16` (home Wi-Fi) |

**In AWS:**
- Every EC2 instance gets a **private IP** (stays the same until it's terminated).
- A **public IP** is optional and **changes** on stop/start.
- **Elastic IP** = a public IP that I own and that stays the same; I attach it to an instance.

## CIDR: how many addresses?

**CIDR** = an IP + `/number`. The number = how many bits are **fixed** (the network part). The rest are free for devices.

```
10.0.0.0/16  → first 16 bits fixed (10.0), last 16 bits free → 2^16 = 65,536 addresses
10.0.1.0/24  → first 24 bits fixed (10.0.1), last 8 free     → 2^8  = 256 addresses
```

| CIDR | Addresses | Typical use |
|------|-----------|-------------|
| `/16` | 65,536 | a whole VPC |
| `/24` | 256 | one subnet |
| `/28` | 16 | smallest subnet AWS allows |
| `/32` | 1 | exactly one IP (e.g. "my IP" in a security group) |
| `0.0.0.0/0` | all | "anywhere" (the whole internet) |

**Formula:** addresses = 2^(32 − prefix). Bigger number after `/` = smaller network.

**AWS keeps 5 IPs in every subnet:** first 4 + last 1. A `/24` subnet gives **251** usable IPs.

| In `10.0.1.0/24` | Used for |
|------------------|----------|
| `.0` | network address |
| `.1` | VPC router |
| `.2` | DNS server |
| `.3` | reserved for future use |
| `.255` | broadcast (not supported, still reserved) |

## Ports

IP = which **house**; port = which **door** (which program). See [security groups](03-security-groups-nacl.md).

| Port | Service |
|------|---------|
| 22 | SSH |
| 80 / 443 | HTTP / HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 27017 | MongoDB |

## Interview one-liners

- **Public IP** = reachable from the internet; **private IP** = only inside the VPC.
- **CIDR `/24`** = 256 addresses; AWS keeps 5 per subnet → 251 usable.
- **Elastic IP** = a fixed public IP that survives stop/start.
- **`0.0.0.0/0`** = anywhere; **`/32`** = one exact IP.
