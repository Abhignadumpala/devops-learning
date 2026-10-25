# Linux Theory: The Basics Behind the Commands

The "why" behind the commands in the other folders: what Linux is, how it's organised, and how users, permissions, packages, services and processes work.

[← Back to Linux commands](../README.md)

---

## 1. What is an OS?

A computer = **hardware** (CPU, RAM, storage) + **software** (the OS and apps).

| Part | Human analogy |
|------|---------------|
| CPU | brain |
| RAM | short-term memory |
| Storage | long-term memory |
| OS | how we think and behave |

```
┌──────────────────────┐
│     Applications     │  ← browsers, nginx, my apps
├──────────────────────┤
│        Shell         │  ← takes my commands (bash)
├──────────────────────┤
│        Kernel        │  ← talks to the hardware
├──────────────────────┤
│ Hardware (CPU, RAM,  │
│       Storage)       │
└──────────────────────┘
```

**OS = Kernel + Shell + Applications**

---

## 2. Linux history and distributions

- **Unix** came as hardware + software together and was very costly.
- **1991:** Linus Torvalds wrote the **Linux kernel** in C, inspired by Unix. Free and open source.
- **2005:** he also created **Git**, to manage the kernel's source code.

Linux runs most servers, the cloud, Android and all top supercomputers. That's why DevOps needs Linux.

**Distribution (distro)** = Linux kernel + shell + apps, packaged by a company or community.

| Distro | Family | Package manager |
|--------|--------|-----------------|
| RHEL, Amazon Linux, CentOS, AlmaLinux | Red Hat | `dnf` (older: `yum`) |
| Ubuntu, Debian | Debian | `apt` |

| Enterprise (RHEL, SUSE) | Community (Ubuntu, AlmaLinux) |
|-------------------------|-------------------------------|
| paid, immediate support | free, community support |

---

## 3. The directory layout

Everything starts at `/` (root). Every top-level folder has one job:

| Folder | What it's for |
|--------|---------------|
| `/bin`, `/sbin` | everyday commands / admin commands |
| `/boot` | files to start the server (kernel, boot loader) |
| `/dev` | devices: disks, keyboard (the kernel shows them as files) |
| `/etc` | **system config**: `/etc/passwd`, `/etc/fstab`, `/etc/nginx`, `/etc/systemd` |
| `/home` | each user's own folder, e.g. `/home/ec2-user` |
| `/root` | home folder of the root user |
| `/opt` | third-party software I install myself (opt = optional) |
| `/mnt` | where I mount an extra disk by hand |
| `/proc` | live process and system info (`/proc/cpuinfo`, `/proc/meminfo`) |
| `/tmp` | temporary files |
| `/var` | data that changes all the time, mainly **logs** (`/var/log`) |

**Absolute vs relative path:** `/home/ec2-user/app.sh` starts from `/` (works from anywhere). `app.sh` or `../app.sh` starts from the folder I'm in now.

> In Linux, **everything is a file**: config, devices, even process info.

---

## 4. Files: inodes and links

Every file has 2 parts:

| Part | Holds |
|------|-------|
| **Inode** | metadata: owner, group, permissions, size, timestamps (like an ID card) |
| **Content** | the actual data, stored separately |

| | Symlink (soft link) | Hard link |
|-|---------------------|-----------|
| Is | a shortcut that points to a path | another name for the same file |
| Inode | its own, different inode | the **same** inode |
| Target deleted | link **breaks** | file still exists until every name is gone |
| Folders? | yes | no |
| Command | `ln -s target link` | `ln target link` |

---

## 5. Users and groups

| | Meaning |
|-|---------|
| **User** | one person or one application |
| **Group** | a list of users; permissions are given to the group |
| **root** | the admin user, UID `0`, prompt `#` (normal user: `$`) |

| User type | UID |
|-----------|-----|
| root | 0 |
| system users (for services, e.g. `nginx`) | 1–999 |
| normal users | 1000+ |

Important files: `/etc/passwd` (users), `/etc/group` (groups), `/etc/shadow` (password hashes), `/etc/sudoers` (who gets admin).

**Authentication vs authorization:**

| | Question | Example |
|-|----------|---------|
| Authentication | Who are you? | password, SSH key |
| Authorization | What are you allowed to do? | can you delete this file? |

**Role-based access:** give permissions to a **group** (trainees, juniors, seniors), then add or move users between groups. No need to change permissions person by person.

**sudo** = run one command as root. Given by adding the user to the `wheel` group, or a file in `/etc/sudoers.d/`.

---

## 6. Permissions

```
-rwxr-xr--
│└┬┘└┬┘└┬┘
│ │  │  └── others: r--
│ │  └───── group:  r-x
│ └──────── owner:  rwx
└────────── - = file, d = directory
```

| Letter | Permission | Value | On a file | On a folder |
|--------|------------|-------|-----------|-------------|
| `r` | read | 4 | read content | list files |
| `w` | write | 2 | change content | create/delete files inside |
| `x` | execute | 1 | run it | `cd` into it |

`rwx` = 4+2+1 = **7**, `r-x` = **5**, `r--` = **4** → `chmod 754 file`.

- Only the **owner** or **root** can change permissions (`chmod`).
- Only **root** can change the owner (`chown`).

---

## 7. Packages

A **package** = software ready to install. **Repositories** = online stores of packages the server downloads from.

| Distro | Command | Repo files |
|--------|---------|------------|
| RHEL / Amazon Linux | `dnf install nginx -y` | `/etc/yum.repos.d/*.repo` |
| Ubuntu | `apt install nginx -y` | `/etc/apt/sources.list` |

- `-y` = answer yes automatically (needed in scripts).
- Software not in the default repos (e.g. MongoDB) needs its own `.repo` file first.
- `dnf module enable redis:7` picks a specific version when RHEL offers several.

---

## 8. Services (systemd)

A **service** = a program that runs all the time in the background (sshd, nginx, mysqld). **systemd** manages them.

| Command | Meaning |
|---------|---------|
| `systemctl start nginx` | run it **now** |
| `systemctl enable nginx` | run it at **every boot** |
| `systemctl restart nginx` | stop + start; **needed after a config change** |
| `systemctl status nginx` | is it running? |
| `systemctl daemon-reload` | re-read `.service` files after adding/changing one |
| `journalctl -u nginx` | the service's logs |

> `start` does nothing if the service is already running. After changing a config file, use **restart**.

**Service file** (`/etc/systemd/system/<app>.service`) = how to run my own app as a service: which command, which user, which environment variables, restart if it crashes.

---

## 9. Processes

**Everything running is a process.** Every process has:

| | Meaning |
|-|---------|
| **PID** | process ID |
| **PPID** | parent process ID (the process that started it) |

| | Foreground | Background |
|-|------------|------------|
| Terminal | busy until it ends | free |
| Example | `sleep 60` | `sleep 60 &` |

`ps -ef` lists all processes. `kill <PID>` asks a process to stop; `kill -9 <PID>` forces it.

---

## 10. Network basics

Each service **listens on a port** (0–65535).

| Service | Port |
|---------|------|
| SSH | 22 |
| HTTP / HTTPS | 80 / 443 |
| MySQL | 3306 |
| Apps / Jenkins | 8080 |

| Command | Run on | Checks |
|---------|--------|--------|
| `ss -lntp` | the **server** | which ports it listens on, and on which address |
| `telnet <host> <port>` | the **caller** | can I reach that port? |

| Listen address | Meaning |
|----------------|---------|
| `127.0.0.1:port` | only this server can connect |
| `0.0.0.0:port` | other servers can connect (if the firewall allows) |

---

## 11. Disk and memory

| Command | Shows |
|---------|-------|
| `df -hT` | disk space per mounted disk |
| `du -sh *` | size of each item in this folder |
| `free -m` | RAM usage |
| `lsblk` | disks and partitions |

- **Swap** = disk space used as extra RAM when RAM is full. Swap in use = the server gets slow.
- Adding a disk: attach → partition → format (`mkfs.xfs`) → mount → add to `/etc/fstab` so it survives a reboot.

---

## 12. Troubleshooting order

App not working? I check in this order:

| # | Check | Command |
|---|-------|---------|
| 1 | Am I on the right server? | look at the prompt hostname |
| 2 | Service running? | `systemctl status <svc>` |
| 3 | Listening on the port, on `0.0.0.0`? | `ss -lntp` |
| 4 | Reachable from the caller? (firewall / SG) | `telnet <host> <port>` |
| 5 | What do the logs say? | `journalctl -u <svc>`, `/var/log/...` |

---

## Interview one-liners

- **OS** = kernel (talks to hardware) + shell (takes my commands) + apps.
- **Distro** = Linux kernel + tools packaged by a vendor; RHEL family uses `dnf`, Debian family uses `apt`.
- **`/etc`** = config, **`/var/log`** = logs, **`/opt`** = third-party installs.
- **Inode** = a file's metadata, not its content. Symlink = shortcut (own inode); hard link = same inode.
- **Authentication** = who you are; **authorization** = what you can do.
- **`chmod 755`** = owner rwx, group r-x, others r-x.
- **`start` vs `enable`**: now vs at every boot. **`restart`** after a config change.
- **`127.0.0.1`** = local only; **`0.0.0.0`** = all interfaces.
