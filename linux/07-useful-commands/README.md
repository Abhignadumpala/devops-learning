# Useful Commands

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `history --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

## What the command names mean

Knowing the full name makes the command easy to remember.

```
history -> history of commands I typed
clear   -> clear the screen
man     -> manual
--help  -> short help for any command
```

```
history          -> list previously used commands
clear            -> clear the screen
man <command>    -> manual/help for any command
```

## Getting help for any command

I don't need to remember every flag. Every command can show all its options:

```
grep --help          -> quick list of everything grep can do (all flags with short meaning)
ls --help            -> works for almost any command: <command> --help
grep --help | less   -> if the help is long, read page by page (q to quit)
grep --help | grep -i count  -> search inside the help for the flag I need
man grep             -> full detailed manual (q to quit, /word to search inside)
```

Note: it's `--help` with **two dashes**. `grep -help` (one dash) doesn't work, because grep reads it as the flags `-h -e lp`.
