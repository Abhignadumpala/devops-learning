# Files & Folders (CRUD)

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `mkdir --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

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
