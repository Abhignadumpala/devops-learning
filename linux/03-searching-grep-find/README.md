# Searching (find & grep)

## find (search for files by name)

```
find . -name "*.txt"   -> find all .txt files in current folder
```

## grep (search inside files)

```
grep "DevOps" <file-name>     -> search a word inside a file
grep -i "devops" <file-name>  -> search ignoring upper/lower case
grep -r "DevOps" <folder>     -> search inside all files in a folder
```

More examples:

```
grep linux linux.md       -> lines with "linux" only (case sensitive)
grep -i linux linux.md    -> ignore case, finds linux / Linux / LINUX
grep -v linux linux.md    -> show lines that do NOT contain linux (opposite)
grep -n linux linux.md    -> show matching lines with line numbers
grep -c linux linux.md    -> count how many lines matched
grep -w linux linux.md    -> match whole word only (won't match "linuxos")
grep -r linux .           -> search in all files inside current folder
grep -l linux *           -> show only the file NAMES that contain linux
grep -in linux linux.md   -> ignore case and show with line number
```

## A simple way to remember the grep flags

```
-i -> ignore case
-v -> reverse (NOT matching)
-n -> numbers (line numbers)
-c -> count
-w -> whole word
-r -> recursive (all files in folder)
-l -> list file names only
```

Using grep with a pipe `|` to filter the output of other commands -> see [Pipes & redirection](../05-pipes-and-redirection/).

To see every flag grep has: `grep --help` (or `man grep` for the full manual) -> see [Useful commands](../07-useful-commands/).
