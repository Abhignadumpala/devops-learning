# Useful Commands

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
