# Navigation

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `cd --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

## What the command names mean

Knowing the full name makes the command easy to remember.

```
pwd    -> print working directory
ls     -> list
cd     -> change directory
tree   -> shows folders as a tree
which  -> which file runs when I type this command
file   -> tells what type of file it is
du     -> disk usage
pushd  -> push directory (save current folder, go to new one)
popd   -> pop directory (go back to the saved folder)
```

## Quick version (my first notes)

```
pwd            -> shows present working directory (where you are)
cd <folder>    -> go inside the folder
cd ..          -> go back one level
cd ~           -> go to home directory
cd -           -> go back to the previous directory
```

Everything below explains these in detail.

---

## 1. What is navigation?

In Linux everything is organised as folders inside folders, like a tree. The very top is `/` (called **root**). Every file and folder lives somewhere under `/`.

On a server there is no mouse or file explorer, so I move around using commands:

```
pwd  -> "where am I?"
ls   -> "what is here?"
cd   -> "go there"
```

These three are used all the time, before almost every other command.

## 2. pwd: where am I?

**pwd** = **p**rint **w**orking **d**irectory. It shows the full path of the folder I'm currently in.

```
pwd
/home/abhi/devops-learning
```

Useful when I'm lost after lots of `cd`, or before running something like `rm` so I know exactly where I am.

## 3. ls: what is inside this folder?

**ls** = **l**i**s**t. It shows the files and folders in the current folder (or in any folder I give it).

```
ls                -> list files and folders here
ls /etc           -> list what's inside /etc (without going there)
ls -l             -> long list: permissions, owner, size, date
ls -a             -> show hidden files too (names starting with a dot, like .gitignore, .bashrc)
ls -la            -> long list + hidden files (most used)
ls -lh            -> sizes in human format (4.0K, 12M, 1.2G instead of bytes)
ls -lt            -> newest files first (sorted by time)
ls -ltr           -> oldest first, newest at the bottom (good for log folders)
ls -R             -> list this folder and every folder inside it
ls -d */          -> list only folders
```

In `ls -l` output, lines starting with `d` are folders and lines starting with `-` are files (see [Permissions](../04-permissions/) for the rest of that line).

## 4. cd: move between folders

**cd** = **c**hange **d**irectory. It moves me into another folder.

```
cd devops-learning     -> go into the devops-learning folder (inside where I am now)
cd linux/01-navigation -> go several folders down in one go
cd /var/log            -> go straight to /var/log from anywhere
cd ..                  -> go back (up) one level, to the parent folder
cd ../..               -> go up two levels
cd ../docker           -> go up one level, then into docker (a "sibling" folder)
cd ~                   -> go to my home folder (/home/abhi)
cd                     -> same as cd ~ (cd with nothing = go home)
cd ~/devops-learning   -> go to a folder inside my home, from anywhere
cd -                   -> go back to the folder I was in before (like the back button)
cd /                   -> go to the very top (root) of the file system
```

If the folder name has spaces, use quotes: `cd "My Folder"`.

Example walkthrough:

```
pwd                    -> /home/abhi
cd devops-learning     -> now in /home/abhi/devops-learning
cd linux               -> now in /home/abhi/devops-learning/linux
cd ..                  -> back to /home/abhi/devops-learning
cd /var/log            -> jump to /var/log
cd -                   -> back to /home/abhi/devops-learning
cd                     -> home: /home/abhi
```

## 5. Special symbols in paths

```
/    -> root, the top of everything (also the separator between folders)
~    -> my home folder (/home/abhi), for root user it's /root
.    -> the current folder (e.g. ./script.sh = run script.sh from here)
..   -> the parent folder (one level up)
-    -> the previous folder (only with cd)
```

## 6. Absolute path vs relative path

```
absolute path -> starts with /  -> full address from root, works from anywhere
                 cd /home/abhi/devops-learning/linux

relative path -> no / at start  -> starts from where I am now (pwd)
                 cd linux        (only works if linux is inside my current folder)
```

Simple way to remember:

```
absolute -> full home address
relative -> "two doors down from here"
```

In scripts and cron jobs, use absolute paths, because the script might run from a different folder.

## 7. Tab completion (saves a lot of typing)

```
cd dev + Tab      -> auto-completes to cd devops-learning/
cd l + Tab Tab    -> if many matches, press Tab twice to see all options
```

It also prevents typos: if Tab doesn't complete, the folder probably doesn't exist.

## 8. Important Linux folders (good to know for servers & interviews)

```
/            -> root, top of everything
/home        -> home folders of normal users (/home/abhi, /home/ravi)
/root        -> home folder of the root (admin) user
/etc         -> configuration files (e.g. /etc/nginx/nginx.conf, /etc/passwd, /etc/ssh/sshd_config)
/var/log     -> log files (e.g. /var/log/syslog, /var/log/nginx/access.log)
/var/www     -> website files (often used by nginx/apache)
/tmp         -> temporary files, usually cleared on reboot
/bin, /usr/bin -> commands/programs (ls, cat, grep live here)
/sbin, /usr/sbin -> admin commands (useradd, reboot)
/opt         -> extra software installed manually
/dev         -> devices (disks like /dev/sda, /dev/xvda on AWS)
/mnt, /media -> where extra disks/USBs are mounted
/proc        -> live info about running processes and the system (e.g. /proc/cpuinfo)
```

Typical DevOps moves:

```
cd /var/log && ls -ltr          -> check the newest logs
cd /etc/nginx && ls             -> look at nginx config
cd /var/www/html                -> where nginx serves the default website from
```

## 9. More navigation helpers

```
tree                  -> show folders and files as a tree (install: sudo apt install tree)
tree -L 2             -> only 2 levels deep
which <command>       -> where the program lives (which grep -> /usr/bin/grep)
file <name>           -> what type is it (text, folder, program, image...)
du -sh <folder>       -> how much space a folder uses
pushd /var/log        -> go to /var/log and remember where I was
popd                  -> go back to the remembered folder
```

`&&` runs the next command only if the first worked: `cd /var/log && ls` (if cd fails, ls doesn't run in the wrong folder).

---

## Simple way to remember

```
pwd       -> where am I?
ls        -> what's here?
ls -la    -> everything, including hidden files
ls -lh    -> readable sizes (K, M, G)
ls -ltr   -> newest files at the bottom
cd        -> go there
cd ..     -> go up one level
cd ~      -> go home
cd        -> go home (same as cd ~)
cd -      -> go back to the previous folder
/path     -> starts from root (absolute path)
path      -> starts from where I am (relative path)
.         -> this folder
..        -> parent folder
~         -> home folder
Tab       -> auto-complete names
```
