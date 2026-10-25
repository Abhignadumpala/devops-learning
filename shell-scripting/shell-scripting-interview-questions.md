# Shell Scripting: Interview Questions

[← Back to shell scripting notes](README.md)

**1. What is a shebang?**
The first line, `#!/bin/bash`. It tells Linux which program should run the script.

**2. Difference between `$@` and `$#`?**
`$@` = all arguments passed to the script. `$#` = how many there are.

**3. What is `$?`?**
The exit status of the last command. `0` = success, anything else = failure.

**4. Does a script stop when a command fails?**
No. It keeps going unless I check `$?` or use `set -e`.

**5. What does `set -e` do? And `trap ... ERR`?**
`set -e` stops the script at the first failed command. `trap 'echo ... $LINENO' ERR` prints where it failed.

**6. Difference between `>` and `>>`? What is `&>>`?**
`>` overwrites the file, `>>` appends. `&>>` appends both normal output and errors.

**7. What are 1 and 2 in `2>>`?**
Output streams: `1` = stdout (normal output), `2` = stderr (errors). Not exit codes.

**8. What does `tee -a` do?**
Shows the output on screen and appends it to a file.

**9. `$( )` vs `${ }`?**
`$( )` runs a command and gives its output. `${ }` reads a variable.

**10. Why `"$var"` with double quotes in a test?**
If the variable is empty, `[ $var -eq 0 ]` breaks. `[ "$var" -eq 0 ]` or `[ -z "$var" ]` stays valid.

**11. Single vs double quotes?**
Double quotes expand variables (`"$name"` → value). Single quotes keep text as is (`'$name'`).

**12. Does shell have data types?**
No, everything is a string. `$(( ))` does maths; `declare -i` marks an integer.

**13. What is a function and why use one?**
A named block of code. Write it once (e.g. `validate`), call it after every step; fix it in one place.

**14. How do you make a script idempotent?**
Check before creating: `id user` before `useradd`, `mkdir -p`, count rows before loading data. A 2nd run prints SKIPPING instead of failing.

**15. How does a script find its own folder after `cd`?**
`script_dir=$(dirname "$(realpath "$0")")` at the top, then use `$script_dir/file`.

**16. Why check that the script runs as root?**
`dnf`, `useradd` and `systemctl` need root. `id -u` = `0` means root; otherwise print a message and `exit 1`.

**17. `systemctl start` vs `restart` in a script?**
`start` does nothing if it's already running, so new config is ignored. `restart` always loads changes.

**18. Why send command output to a log file?**
The screen shows only SUCCESS / FAILED; the full detail stays in the log for debugging.

**19. What are the limits of shell scripts?**
No change history or rollback (Git), no automatic runs or tests (CI/CD), and idempotency has to be written by hand (Ansible / Terraform do it by design).

**20. `sh script.sh` vs `bash script.sh`?**
On Ubuntu, `sh` is dash, a smaller shell: `echo -e` and some bash features behave differently. Use `bash`.
