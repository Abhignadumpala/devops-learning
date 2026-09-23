# Files & Folders (CRUD)

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `mkdir --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

## What the command names mean

Knowing the full name makes the command easy to remember.

```
touch  -> "touches" a file: creates it if missing, else updates its time
mkdir  -> make directory
cat    -> concatenate (joins files and prints them)
head   -> top (head) of the file
tail   -> bottom (tail) of the file
less   -> page-by-page viewer (improved version of the old "more" command: "less is more")
wc     -> word count (also counts lines with -l)
echo   -> repeats (echoes) back the text I give
vim    -> vi improved (text editor)
cp     -> copy
mv     -> move (also used to rename)
rm     -> remove
rmdir  -> remove directory

Common flags:
-p     -> parents (mkdir -p creates parent folders too)
-r     -> recursive (folder and everything inside)
-f     -> force (no questions asked)
-n     -> number (head -n 5 = number of lines, cat -n = line numbers)
```

CRUD -> **C**reate, **R**ead, **U**pdate, **D**elete (files and folders). Simple logic to remember.

## Creating

```
touch a.txt b.txt c.txt   -> create multiple files at once
mkdir <folder-name>       -> create a folder
mkdir dir1 dir2           -> create multiple folders
mkdir -p aws/ec2/logs     -> create nested folders in one go
```

## Reading

```
cat <file-name>           -> display file content
cat -n <file-name>        -> display content with line numbers
head <file-name>          -> first 10 lines
head -n 5 <file-name>     -> first 5 lines
tail <file-name>          -> last 10 lines
tail -f <file-name>       -> watch the file live (used for logs)
less <file-name>          -> read page by page, press q to quit
wc -l <file-name>         -> count number of lines
```

## Updating

```
echo "text" > <file-name>   -> overriding
echo "text" >> <file-name>  -> appending
vim <file-name>             -> open file in editor (i = insert, Esc then :wq = save & quit)
```

## Copy / Move / Rename

```
cp <source> <destination>      -> copy file
cp -r <folder1> <folder2>      -> copy folder with everything inside
mv <old-name> <new-name>       -> rename file/folder
mv <file-name> <folder-name>/  -> move file into folder
```

## Deleting

```
rm <file-name>          -> delete file
rm -r <folder-name>     -> delete folder with its contents
rm -rf <folder-name>    -> force delete, no confirmation (be careful!)
rmdir <folder-name>     -> delete only if folder is empty
```
