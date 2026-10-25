# Shell Scripting: Basics and Theory

What shell scripting is, why DevOps uses it, and every building block with a short example.
Real scripts I wrote with all of this: [RoboShop shell scripts](https://github.com/Abhignadumpala/shellscript-roboshop-v1).

---

## Table of Contents

1. [Why scripting](#1-why-scripting)
2. [Building blocks](#2-building-blocks)
3. [Shebang and running a script](#3-shebang-and-running-a-script)
4. [Variables](#4-variables)
5. [Special variables](#5-special-variables)
6. [Data types](#6-data-types)
7. [Exit status](#7-exit-status)
8. [Conditions](#8-conditions)
9. [Functions](#9-functions)
10. [Loops](#10-loops)
11. [Redirections and logs](#11-redirections-and-logs)
12. [Error handling](#12-error-handling)
13. [Idempotency](#13-idempotency)
14. [A good script template](#14-a-good-script-template)
15. [What scripts can't solve](#15-what-scripts-cant-solve)

---

## 1. Why scripting

Doing server work by hand has the same problems every time:

| Manual | With a script |
|--------|---------------|
| only I know the steps | the steps are written down |
| slow, every time | run one command |
| typos, missed steps | same steps, same order, every time |
| no record of what ran | logs show every step |

**Programming vs scripting:** developers *program* applications; DevOps *scripts* tasks (install, configure, deploy).

---

## 2. Building blocks

Every scripting language is learned in this order:

```
Variables → Data types → Conditions → Functions → Loops → Error handling
 (store)    (what kind)   (decide)     (reuse)    (repeat)  (catch failures)
```

> Think first, code second: write the steps in plain English (algorithm / pseudocode), then turn them into code.

---

## 3. Shebang and running a script

```bash
#!/bin/bash

# a comment: the shell doesn't run it
echo "Hello World"
```

- `#!/bin/bash` (the **shebang**) must be the **first line**. It tells Linux which program runs the file.
- `#` = comment.

| Run it | Note |
|--------|------|
| `bash script.sh` | always works |
| `chmod +x script.sh` then `./script.sh` | uses the shebang |
| `sh script.sh` | on Ubuntu `sh` is **dash**, a smaller shell; some bash features break. Prefer `bash` |

---

## 4. Variables

```bash
name="Abhi"                 # no spaces around =
echo "Hello $name"          # Hello Abhi
echo "${name}DevOps"        # AbhiDevOps: {} marks where the name ends

today=$(date +%F)           # $( ) runs a command and stores its output
user_id=$(id -u)            # 0 = root
```

| Rule | Example |
|------|---------|
| no spaces around `=` | `name = "x"` → error "command not found" |
| case-sensitive | `$NAME` and `$name` are different |
| `$( )` runs a command | `$(date)` |
| `${ }` is for variables | `${name}` |
| double quotes expand variables, single quotes don't | `"$name"` → Abhi, `'$name'` → $name |

**Environment variables:** `export COURSE="DevOps"` makes it visible to child processes. It lasts until logout; to keep it, put it in `~/.bashrc` (one user) or `/etc/profile.d/*.sh` (all users).

**Reading input:** `read marks` waits for the user to type a value.

---

## 5. Special variables

Given for free by the shell. Example run: `bash script.sh John Raheem`

| Variable | Gives | Example |
|----------|-------|---------|
| `$0` | script name | `script.sh` |
| `$1`, `$2` | 1st, 2nd argument | `John`, `Raheem` |
| `$@` | all arguments | `John Raheem` |
| `$#` | number of arguments | `2` |
| `$?` | exit status of the last command | `0` |
| `$$` | PID of this script | `2345` |
| `$!` | PID of the last background command | `2346` |
| `$USER`, `$HOME`, `$PWD` | who runs it, their home, current folder | |
| `$LINENO` | current line number | `15` |
| `$SECONDS` | seconds since the script started | `10` |

**Script's own folder** (works from any folder, even after `cd`):
```bash
script_dir=$(dirname "$(realpath "$0")")
```

---

## 6. Data types

Shell has **no real data types**: everything is a string.

```bash
a=10; b=20
echo "$a+$b"           # 10+20   (just text)
echo "$((a+b))"        # 30      ($(( )) does maths)

fruits=("Apple" "Banana")
echo "${fruits[0]}"    # Apple   (arrays start at 0)
echo "${fruits[@]}"    # Apple Banana
```

---

## 7. Exit status

Every command leaves an **exit status** in `$?`:

| `$?` | Meaning |
|------|---------|
| `0` | success |
| anything else | **failure** (`127` = command not found, `126` = not executable) |

```bash
ls /tmp;      echo $?    # 0
ls /nofolder; echo $?    # 2
```

> A script **does not stop by itself** when a command fails. Checking `$?` is my job.

**Exit code vs output streams:** don't mix them up.

| | Numbers | Meaning |
|-|---------|---------|
| exit code `$?` | `0` / non-zero | did it work? |
| stream `1` / `2` | stdout / stderr | where does the text go? |

---

## 8. Conditions

```bash
if [ $marks -lt 33 ]; then
    echo "Fail"
elif [ $marks -lt 75 ]; then
    echo "Pass"
else
    echo "Distinction"
fi
```

| Numbers | Meaning | Strings / files | Meaning |
|---------|---------|-----------------|---------|
| `-eq` / `-ne` | equal / not equal | `==` / `!=` | same / different text |
| `-lt` / `-le` | less than / ≤ | `-z "$x"` | `x` is empty |
| `-gt` / `-ge` | greater than / ≥ | `-n "$x"` | `x` is not empty |
| | | `-f file` / `-d dir` | file / folder exists |

- `fi` closes the `if`. Checks run top to bottom and stop at the first true one.
- `||` = OR, `&&` = AND: `if [ -z "$count" ] || [ "$count" -eq 0 ]; then`
- Always quote variables in tests: `"$count"`. An empty unquoted variable breaks the test.

---

## 9. Functions

A named block of code: write once, call many times.

```bash
validate(){
    if [ $1 -ne 0 ]; then
        echo "$2 ... FAILED"
        exit 1
    else
        echo "$2 ... SUCCESS"
    fi
}

dnf install nginx -y
validate $? "Installing nginx"
```

- Define it **above** where I call it (bash reads top to bottom).
- Inside a function, `$1`, `$2` are the values passed **to the function**.

---

## 10. Loops

Run the same steps for many values:

```bash
for package in nginx mysql git          # a list
do
    dnf install $package -y
done

for package in $@                       # every argument: bash install.sh nginx git
do
    echo "installing $package"
done

for i in {1..5}; do echo $i; done       # a range
```

`do ... done` = the body; it runs once per value.

---

## 11. Redirections and logs

Every command has 2 output streams: **1 = stdout** (normal output), **2 = stderr** (errors).

| Symbol | Sends | To the file |
|--------|-------|-------------|
| `>` / `>>` | normal output | overwrite / append |
| `2>` / `2>>` | errors | overwrite / append |
| `&>` / `&>>` | both | overwrite / append |
| `\| tee -a file` | output | screen **and** file |
| `\|` (pipe) | output of one command | into the next command: `ps -ef \| grep nginx` |

**Log pattern:** long command output goes to a log file; only SUCCESS / FAILED shows on screen.

```bash
logs_file="/var/log/myapp/$0.log"
dnf install nginx -y &>> $logs_file
validate $? "Installing nginx"
```

**Catch output, send errors to the log:**
```bash
count=$(mysql -e "SELECT COUNT(*) FROM db.table;" 2>> $logs_file)
```
`$( )` stores the normal output (the number) in `count`; `2>>` sends any error text to the log.

**Colours:** `echo -e "\e[32mSUCCESS\e[0m"`: 31 red, 32 green, 33 yellow, 0 reset. `-e` makes the codes work.

---

## 12. Error handling

| Error type | Example | What I do |
|------------|---------|-----------|
| Known | not root, install fails, user exists | check it: `$?`, `if`, clear message, `exit 1` or skip |
| Unknown | network drop, disk full | can't predict: **log everything** |

**Stop on any error:**
```bash
set -e                                                           # exit at the first failed command
trap 'echo "Error at line $LINENO: $BASH_COMMAND"' ERR           # show where it failed
```

| Approach | Use when |
|----------|----------|
| `$?` + `validate` | I want a clear message per step |
| `set -e` + `trap` | stop on any error automatically and show the line |

> With `set -e`, put "check" commands inside the `if` (`if ! id roboshop; then ...`), otherwise their expected failure stops the script.

---

## 13. Idempotency

**Idempotent** = the script gives the **same result** no matter how many times I run it or retry it.

| Step | Without a check (2nd run) | Check |
|------|---------------------------|-------|
| create user | fails: user exists | `id roboshop` → create only if missing |
| create folder | fails: exists | `mkdir -p` |
| unzip code | asks "replace?" and hangs | `rm -rf /app/*` first |
| load data | loaded twice | count first, load only if 0 |
| apply config | `start` ignores it | `systemctl restart` |

**Pattern:** check → if missing, create → else SKIPPING.

---

## 14. A good script template

```bash
#!/bin/bash

user_id=$(id -u)
logs_folder="/var/log/myapp"
logs_file="$logs_folder/$(basename $0).log"
script_dir=$(dirname "$(realpath "$0")")

if [ $user_id -ne 0 ]; then
    echo "Please run with sudo"
    exit 1
fi

mkdir -p $logs_folder

validate(){
    if [ $1 -ne 0 ]; then
        echo -e "$(date +'%F %T') [ERROR] $2 ... \e[31mFAILED\e[0m" | tee -a $logs_file
        exit 1
    else
        echo -e "$(date +'%F %T') [INFO] $2 ... \e[32mSUCCESS\e[0m" | tee -a $logs_file
    fi
}

dnf install nginx -y &>> $logs_file
validate $? "Installing nginx"

systemctl enable nginx &>> $logs_file
systemctl restart nginx
validate $? "Starting nginx"

echo "Completed in $SECONDS seconds"
```

| Part | Why |
|------|-----|
| root check | `dnf`, `systemctl` need root; fail early |
| log file | clean screen, full detail kept |
| `script_dir` | find my own files even after `cd` |
| `validate` after every step | stop at the first failure |
| `restart` at the end | every change gets loaded |
| `$SECONDS` | measured run time |

---

## 15. What scripts can't solve

| Problem | Fixed by |
|---------|----------|
| no history of who changed what | **Git** |
| no rollback to a good version | **Git** |
| still started by hand, no tests | **CI/CD** |
| passwords inside scripts | secrets manager |
| every `if` check written by hand | **Ansible / Terraform** (idempotent by design) |

---

Interview questions: [shell-scripting-interview-questions.md](shell-scripting-interview-questions.md)
