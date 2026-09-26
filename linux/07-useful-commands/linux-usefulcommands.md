# Linux Fundamentals: Don't Start by Memorising Commands

**Author:** Abhigna & Srikanth  
**Date:** September 2026  
**Tags:** `#beginners` `#learning` `#linux` `#devops`

---

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Linux Architecture](#understanding-linux-architecture)
3. [Processes](#processes)
4. [Services vs Processes](#services-vs-processes)
5. [Troubleshooting with Logs](#troubleshooting-with-logs)
6. [Filesystem Structure](#filesystem-structure)
7. [Disk Space Management](#disk-space-management)
8. [File Operations](#file-operations)
9. [Permissions](#permissions)
10. [Ownership](#ownership)
11. [Verification Habit](#verification-habit)
12. [Quick Command Reference](#quick-command-reference)

---

## Introduction

When learning Linux, it's easy to fall into the trap of memorizing commands without understanding when to use them.

```
ps, top, systemctl, journalctl, chmod, chown, grep, find...
```

**The key insight:** Knowing what a command does ≠ Knowing when to use it.

### Better Approach

Connect commands to **real problems** on the system:
- A process is running → A service manages it
- Service failed → Logs explain what happened
- Permission denied → Check file permissions

Once these pieces connect, commands stop feeling random.

---

## Understanding Linux Architecture

### The Stack

```
Applications
     ↓
Shell
     ↓
Kernel
     ↓
Hardware
```

### Each Layer

| Layer | Role | Examples |
|-------|------|----------|
| **Hardware** | Physical machine | CPU, Memory, Storage, Network |
| **Kernel** | Core of Linux | Processes, Memory, Files, Hardware |
| **Shell** | User interaction | bash, zsh, sh |
| **Applications** | Programs running | nginx, docker, python |

### How It Works

When you run `ls`:

```
You → Shell (interprets "ls") → Linux → Hardware responds
```

---

## Processes

### What is a Process?

A **process** is a program currently running. Each has a unique **Process ID (PID)**.

### See Running Processes

```bash
ps aux
```

**Use when:** What's running on this machine?

### Monitor CPU & Memory

```bash
top
```

**Use when:** System feels slow, which process is consuming resources?

### Find Specific Process

```bash
ps aux | grep nginx
```

**Use when:** You need a specific service's PID

### Get Process Details

```bash
ps -p <PID> -o pid,ppid,command
```

Shows:
- Process ID
- Parent Process ID
- Command that started it

### Stop a Process

```bash
kill <PID>
```

If it refuses:

```bash
kill -9 <PID>
```

**⚠️ Important:** Understand what a process does before killing it.

---

## Services vs Processes

This distinction is **critical**:

| Concept | Definition |
|---------|-----------|
| **Process** | Something currently running |
| **Service** | Program managed by the operating system (systemd) |

### Example: Nginx

Nginx runs as one or more processes, but you manage it as a **service**.

### Check Service Status

```bash
systemctl status nginx
```

### Start Service (now only)

```bash
sudo systemctl start nginx
```

### Restart Service

```bash
sudo systemctl restart nginx
```

### Enable Auto-Start on Boot

```bash
sudo systemctl enable nginx
```

### Check if Service is Enabled

```bash
systemctl is-enabled nginx
```

### Key Difference

```
start  → Start the service NOW
enable → Start the service AUTOMATICALLY during boot
```

---

## Troubleshooting with Logs

A service might fail because of:

- Bad configuration
- Missing files
- Port conflicts
- Permission issues
- Dependency problems

**Instead of guessing, check the logs.**

### View Service Logs (recent entries)

```bash
journalctl -u nginx
```

### Show Last 50 Entries

```bash
journalctl -u nginx -n 50
```

### Watch Logs in Real-Time

```bash
journalctl -u nginx -f
```

### Check Activity from Specific Time

```bash
journalctl -u nginx --since "10 min ago"
```

Other time options:

```bash
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx --since "yesterday"
journalctl -u nginx --since "2024-01-15 10:00"
```

### Traditional Log Files

```bash
tail -f /var/log/app.log
```

### The Troubleshooting Flow

```
Service has problem?
        ↓
Check status → systemctl status <service>
        ↓
Check logs → journalctl -u <service> -n 50
        ↓
Fix issue → Apply fix
        ↓
Verify → systemctl status <service>
```

---

## Filesystem Structure

Linux has a standard filesystem. Knowing key locations saves time.

### Root Directory

Everything starts from:

```
/
```

### Important Directories

| Path | Purpose |
|------|---------|
| `/home` | User home directories |
| `/root` | Root user's home |
| `/etc` | System & application configuration |
| `/var/log` | System logs |
| `/tmp` | Temporary files |
| `/bin` | Essential commands |
| `/usr/bin` | Common system commands |
| `/opt` | Third-party software |

### Key Pattern

```
Configuration → /etc
Logs → /var/log
User files → /home
```

### Navigation Commands

**Current location:**

```bash
pwd
```

**Move to directory:**

```bash
cd /var/log
```

**Move up one level:**

```bash
cd ..
```

**List files:**

```bash
ls
```

**List with details:**

```bash
ls -l
```

**Include hidden files:**

```bash
ls -la
```

---

## Disk Space Management

### Check Available Disk Space

```bash
df -h
```

**Output:**
- `h` = human-readable (GB, MB)

### Check Directory Size

```bash
du -sh *
```

**Use when:** Which directories are taking space?

### Find Largest Logs

```bash
du -sh /var/log/* 2>/dev/null | sort -h | tail -5
```

**Breaks down:**
1. `du -sh /var/log/*` = Size of each log
2. `sort -h` = Sort by size
3. `tail -5` = Show largest 5
4. `2>/dev/null` = Hide errors

### Workflow

```
Server running low on space?
        ↓
df -h → Check total usage
        ↓
du -sh * → Find large directories
        ↓
du -sh /var/log/* → Check if logs are culprit
        ↓
Clean up or archive
```

---

## File Operations

### Create Empty File

```bash
touch notes.txt
```

### Create Directory

```bash
mkdir projects
```

### Create Nested Directories

```bash
mkdir -p project/app/logs
```

### Read File Content

```bash
cat notes.txt
```

### Read Large File (scrollable)

```bash
less notes.txt
```

### View First N Lines

```bash
head -n 5 notes.txt
```

### View Last N Lines

```bash
tail -n 5 notes.txt
```

### Write to File (overwrite)

```bash
echo "Hello" > notes.txt
```

**Symbol:** `>` = Overwrite

### Append to File

```bash
echo "Hello" >> notes.txt
```

**Symbol:** `>>` = Append

### Write & Display

```bash
echo "Hello" | tee -a notes.txt
```

Writes to file AND shows on screen.

### Reference Table

| Operator | Action |
|----------|--------|
| `>` | Overwrite file |
| `>>` | Append to file |
| `\|` | Pipe (send output as input) |
| `tee` | Write to file + display |

---

## Permissions

### What Are Permissions?

Linux permissions are based on three access types:

| Letter | Meaning |
|--------|---------|
| `r` | Read |
| `w` | Write |
| `x` | Execute |

### Who Can Access

```
Owner | Group | Others
```

### View Permissions

```bash
ls -l
```

### Permission Format Explained

```bash
-rwxr-xr-x
```

Broken down:

```
- (file type)
rwx (owner: read, write, execute)
r-x (group: read, execute, no write)
r-x (others: read, execute, no write)
```

### Make Script Executable

```bash
chmod +x script.sh
```

### Remove Write Permission

```bash
chmod -w file.txt
```

### Numeric Permissions

```
read    = 4
write   = 2
execute = 1
```

### Example: chmod 755

```bash
chmod 755 script.sh
```

Means:

```
7 = 4+2+1 (Owner: read + write + execute)
5 = 4+1   (Group: read + execute)
5 = 4+1   (Others: read + execute)
```

### Real Example

**Script without execute permission:**

```bash
./script.sh
```

**Error:**

```
Permission denied
```

**Fix:**

```bash
chmod +x script.sh
```

**Now it runs.**

---

## Ownership

### Permissions vs Ownership

| Concept | Question |
|---------|----------|
| **Permissions** | What can people do with this file? |
| **Ownership** | Who does this file belong to? |

Every Linux file has an **owner** and a **group**.

### Check Ownership

```bash
ls -l
```

**Example output:**

```
-rw-rw-r-- 1 ubuntu developers file.txt
```

Shows:
- Owner: `ubuntu`
- Group: `developers`

### Change Owner

```bash
sudo chown username file.txt
```

### Change Group Only

```bash
sudo chgrp groupname file.txt
```

### Change Both Owner & Group

```bash
sudo chown username:groupname file.txt
```

### Change Recursively (directory & contents)

```bash
sudo chown -R username:groupname directory/
```

**Flag:** `-R` = Recursive

### Remember the Commands

```
chmod → changes permissions (what can you do)
chown → changes owner (who owns it)
chgrp → changes group (which group owns it)
```

### Verify Changes

Always check after changing:

```bash
ls -l file.txt
```

---

## Verification Habit

### The Pattern

Running a command ≠ Job is finished.

### Always Verify

**Started a service:**

```bash
sudo systemctl start nginx
```

**Then check:**

```bash
systemctl status nginx
```

---

**Changed permissions:**

```bash
chmod +x script.sh
```

**Then check:**

```bash
ls -l script.sh
```

---

**Changed ownership:**

```bash
sudo chown user:group file.txt
```

**Then check:**

```bash
ls -l file.txt
```

### The Workflow

```
Change something
        ↓
Check the result
        ↓
Test that it works
```

This habit applies far beyond Linux.

---

## Quick Command Reference

### By Problem

#### What's Running?

```bash
ps aux          # All processes
top             # Live view with resources
ps aux | grep nginx  # Find specific process
```

#### Is Service Healthy?

```bash
systemctl status <service>
```

#### Why Did Service Fail?

```bash
journalctl -u <service> -n 50
```

#### What's Using Disk Space?

```bash
df -h           # Overall
du -sh *        # By directory
```

#### Where Am I?

```bash
pwd             # Current location
ls -la          # What's here
```

#### File & Permission Info

```bash
ls -l           # Owner, group, permissions
chmod +x        # Make executable
chown user      # Change owner
```

#### Can't Run This Script?

```bash
ls -l script.sh         # Check permissions
chmod +x script.sh      # Make executable
./script.sh             # Run it
```

#### Find This File

```bash
find / -name "filename"
```

---

## Key Takeaways

✅ **Understand the "why" before memorizing commands**

✅ **Connect commands to real problems**

✅ **Service failing? Check status → Check logs → Fix → Verify**

✅ **Always verify changes with `ls -l` or `systemctl status`**

✅ **Logs explain what went wrong**

✅ **Filesystem has standard structure - know the key paths**

✅ **Permissions and ownership are different concepts**

---

## Resources

- [Linux Filesystem Hierarchy](https://linux.die.net/man/7/hier)
- [systemd documentation](https://systemd.io/)
- [journalctl manual](https://man7.org/linux/man-pages/man1/journalctl.1.html)
- [Linux File Permissions](https://www.gnu.org/software/coreutils/manual/html_node/File-permissions.html)

---

**Last Updated:** Sept 2026  
**Status:** Core fundamentals  
**Next:** Docker basics
