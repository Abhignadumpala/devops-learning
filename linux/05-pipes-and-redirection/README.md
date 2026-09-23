# Pipes & Redirection

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `sort --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

## What the command names mean

Knowing the full name makes the command easy to remember.

```
|      -> pipe
>      -> redirect (overwrite)
>>     -> redirect (append)
sort   -> sort lines in order
uniq   -> unique (removes duplicate lines next to each other, so sort first)
wc     -> word count
ps     -> process status
       -ef = e: every process, f: full format
df     -> disk free
       -h = human readable (G, M instead of bytes)
```

## pipe | (output of one command -> input of next)

`|` is called a **pipe**. It takes the output of the first command and gives it as input to the next one.

### grep with pipe -> filter the output of any command

```
cat linux.md | grep -i linux   -> show lines that contain linux, Linux, LINUX (any case)
cat linux.md | grep -in linux  -> same as above, but also shows the line number of each matching line
```

### More pipe examples

```
ls -l | grep txt                      -> list only files that have "txt" in the name
ls -l | grep ^d                       -> list only folders (lines starting with d)
ls | wc -l                            -> count how many files/folders are here
cat linux.md | wc -l                  -> count lines in the file
cat linux.md | head -5                -> first 5 lines of the file
cat linux.md | tail -3                -> last 3 lines of the file
cat linux.md | sort                   -> show lines in alphabetical order
cat linux.md | sort | uniq            -> sort and remove duplicate lines
cat linux.md | grep -i linux | wc -l  -> count lines that contain linux (any case)
history | grep mkdir                  -> find mkdir commands I used before
ps -ef | grep nginx                   -> check if nginx process is running
df -h | grep /dev                     -> check disk space of mounted disks
```

## Redirect output into a file

```
grep -i error app.log > errors.txt    -> save matching lines into a new file (overriding)
grep -i error app.log >> errors.txt   -> add matching lines to the file (appending)
ls -l > filelist.txt                  -> save the ls output into a file
```

`>` = overriding, `>>` = appending (same as with `echo` in [Files & folders](../02-files-crud/)).
