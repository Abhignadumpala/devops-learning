# Permissions, Users & Groups

> **Tip:** No need to memorize every flag. Run `<command> --help` (two dashes, e.g. `chmod --help`) to see everything a command can do, or `man <command>` for the full manual (q to quit).

## What the command names mean

Knowing the full name makes the command easy to remember.

```
chmod    -> change mode (mode = permissions)
chown    -> change owner
chgrp    -> change group
whoami   -> who am I (my username)
id       -> identity (user id + group ids)
useradd  -> add user
userdel  -> delete user
usermod  -> modify user
passwd   -> password
su       -> switch user (substitute user)
sudo     -> superuser do (run as admin/root)
visudo   -> vi + sudoers (safe editor for the sudoers file)
groupadd -> add group
groupdel -> delete group
gpasswd  -> group password (also used to add/remove group members)
newgrp   -> new group (switch to a group in current shell)
getent   -> get entries (reads users/groups from system databases)
setfacl  -> set file access control list
getfacl  -> get file access control list
ACL      -> access control list
umask    -> user file-creation mask

Letters inside commands:
u  -> user (owner)
g  -> group
o  -> others
a  -> all
r  -> read
w  -> write
x  -> execute
```

## Quick version (my first notes)

```
chmod 755 <file-name>              -> owner rwx, group r-x, others r-x
chmod +x <file-name>               -> make file executable
chown <user>:<group> <file-name>   -> change owner and group
```

Everything below explains these in detail.

---

## 1. Reading permissions with ls -l

```
ls -l app.sh
-rwxr-xr-- 1 abhi devops 120 Sep 23 10:00 app.sh
```

Break it down:

```
-          rwx       r-x       r--       abhi     devops
type       owner     group     others    owner    group
```

```
first character -> type of item
   -            -> file
   d            -> folder (directory)
   l            -> link (shortcut)
next 3          -> what the OWNER (u) can do
next 3          -> what the GROUP (g) can do
last 3          -> what OTHERS (o) can do (everyone else on the server)
```

So in the example: the owner `abhi` can read, write and run it. People in the `devops` group can read and run it. Everyone else can only read it.

```
ls -ld <folder-name>   -> show permissions of the folder itself (not what's inside)
```

## 2. What r, w, x mean

```
          on a FILE                    on a FOLDER
r (read)  -> can open/see the content  -> can list what's inside (ls)
w (write) -> can edit the content      -> can create/delete/rename files inside
x (exec)  -> can run it as a program   -> can enter it (cd)
-         -> no permission
```

Tip: a folder almost always needs `x` along with `r`, otherwise you can see names but can't go inside.

## 3. chmod with numbers (numeric mode)

Each permission has a number. Add them up for each person:

```
r = 4
w = 2
x = 1
- = 0

rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0
```

Three digits = owner, group, others (in that order):

```
chmod 755 app.sh      -> rwxr-xr-x  owner all, group+others read & run (scripts, folders)
chmod 644 notes.txt   -> rw-r--r--  owner read & write, others only read (normal files)
chmod 700 private/    -> rwx------  only owner, nobody else (private folder)
chmod 600 key.pem     -> rw-------  only owner can read/write (SSH keys - ssh refuses keys that are too open)
chmod 775 shared/     -> rwxrwxr-x  owner + group full access, others read (team folder)
chmod 777 file        -> rwxrwxrwx  everyone can do everything (avoid! security risk)
```

## 4. chmod with letters (symbolic mode)

Easier when you only want to change one thing without touching the rest.

```
Who:
u  -> user (owner)
g  -> group
o  -> others
a  -> all

Action:
+  -> add
-  -> remove
=  -> set exactly

What:
r  -> read
w  -> write
x  -> execute
```

```
chmod +x script.sh        -> add execute for everyone
chmod u+x script.sh       -> add execute only for owner
chmod g+w report.txt      -> give group write permission
chmod o-r secret.txt      -> remove read from others
chmod go-rwx secret.txt   -> remove everything from group and others
chmod u=rw,g=r,o= file    -> set exactly: owner rw, group r, others nothing (same as 640)
chmod a-w file            -> remove write from everyone (read-only)
```

## 5. chmod on folders (recursive)

```
chmod -R 755 website/     -> change the folder AND everything inside it
chmod -R g+w shared/      -> give group write on the folder and all files inside
```

Careful: `-R` with numbers gives files `x` too. To fix folders and files separately:

```
find website/ -type d -exec chmod 755 {} \;   -> only folders get 755
find website/ -type f -exec chmod 644 {} \;   -> only files get 644
```

## 6. Changing owner and group (chown / chgrp)

Needs `sudo` because you're changing who owns something.

```
sudo chown ravi file.txt           -> change owner to ravi
sudo chown ravi:devops file.txt    -> change owner to ravi AND group to devops
sudo chown :devops file.txt        -> change only the group
sudo chgrp devops file.txt         -> change only the group (same as above)
sudo chown -R ravi:devops project/ -> change folder and everything inside
```

---

## 7. Users (creating and managing people)

```
whoami                          -> which user am I
id                              -> my user id, group id and all my groups
id ravi                         -> same info for ravi
sudo useradd -m -s /bin/bash ravi  -> create user ravi
                                      -m = make home folder
                                      -s = login shell (bash)
sudo adduser ravi               -> create user interactively (Ubuntu, asks password etc.)
sudo passwd ravi                -> set/change ravi's password
su - ravi                       -> switch to user ravi
sudo userdel -r ravi            -> delete user ravi and his home folder (-r)
cat /etc/passwd                 -> list of all users on the server
```

## 8. Groups (adding people to a team)

A group = a team. Give permissions to the group once, then just add/remove people.

```
groups                          -> which groups am I in
groups ravi                     -> which groups ravi is in
sudo groupadd devops            -> create a group called devops
sudo usermod -aG devops ravi    -> add ravi to devops group
sudo usermod -aG devops,docker ravi  -> add ravi to multiple groups
sudo gpasswd -d ravi devops     -> remove ravi from devops group
sudo groupdel devops            -> delete the group
getent group devops             -> see who is in the devops group
cat /etc/group                  -> list of all groups
```

IMPORTANT: always use `-aG` (a = append). `usermod -G devops ravi` without `-a` REMOVES ravi from all his other groups.

Group changes apply after the user logs out and back in (or run `newgrp devops` to use it in the current shell).

Real example: `sudo usermod -aG docker $USER` -> lets me run docker without sudo (then log out/in).

## 9. Real scenario: give a team access to a shared folder

Goal: `ravi` and `priya` should both read and edit files in `/projects/app`, nobody else should see it.

```
sudo groupadd devops                      -> 1. create the team
sudo usermod -aG devops ravi              -> 2. add people to the team
sudo usermod -aG devops priya
sudo mkdir -p /projects/app               -> 3. create the folder
sudo chown -R root:devops /projects/app   -> 4. give the folder to the devops group
sudo chmod -R 770 /projects/app           -> 5. owner + group full access, others nothing
sudo chmod g+s /projects/app              -> 6. new files inside automatically get the devops group
ls -ld /projects/app                      -> 7. check: drwxrws--- root devops
```

To remove someone's access later: `sudo gpasswd -d ravi devops` -> no need to touch the folder.

## 10. Giving sudo (admin) access

```
sudo usermod -aG sudo ravi     -> Ubuntu/Debian: ravi can now use sudo
sudo usermod -aG wheel ravi    -> Amazon Linux/RHEL/CentOS: same thing, group is called wheel
sudo -l                        -> what sudo commands am I allowed to run
sudo visudo                    -> safely edit sudo rules (/etc/sudoers) - checks for mistakes before saving
```

## 11. ACL: permission for ONE specific person

Normal permissions only have owner / group / others. If I want to give access to just one extra person without adding them to a group, use ACL.

```
setfacl -m u:ravi:rw report.txt      -> give ravi read+write on this file only
setfacl -m g:qa:r report.txt         -> give the qa group read access
setfacl -R -m u:ravi:rwx project/    -> give ravi access to folder and everything inside
setfacl -x u:ravi report.txt         -> remove ravi's special access
setfacl -b report.txt                -> remove all ACLs from the file
getfacl report.txt                   -> see all ACL permissions on the file
```

If a file has an ACL, `ls -l` shows a `+` at the end: `-rw-rw-r--+`

(On minimal servers install it first: `sudo apt install acl`)

## 12. umask (default permissions for new files)

```
umask          -> show current mask, usually 0022
```

New files start from 666, new folders from 777, then umask removes permissions:

```
umask 022 -> new files 644 (rw-r--r--), new folders 755 (rwxr-xr-x)
umask 077 -> new files 600, new folders 700 (private, only me)
```

## 13. Special permissions (good to know for interviews)

```
setuid (4) -> file runs as the file's OWNER, not the person running it
              example: /usr/bin/passwd runs as root so normal users can change their password
              chmod u+s file   -> ls shows -rwsr-xr-x

setgid (2) -> on a folder: new files inside get the folder's group (used in scenario above)
              chmod g+s folder -> ls shows drwxrwsr-x

sticky (1) -> on a folder: people can only delete THEIR OWN files, even if everyone can write
              example: /tmp
              chmod +t folder  -> ls shows drwxrwxrwt
```

With numbers, the special bit goes as a 4th digit in front: `chmod 2770 folder` = setgid + 770.

---

## Simple way to remember

```
ls -l            -> see permissions
chmod            -> change WHAT they can do (r w x)
chown            -> change WHO owns it (owner and group)
chgrp            -> change only the group
useradd          -> create a user
passwd           -> set the user's password
groupadd         -> create teams
usermod -aG      -> add person to team (always -a!)
gpasswd -d       -> remove person from team
setfacl          -> give access to one extra person
r                -> 4
w                -> 2
x                -> 1
7                -> rwx
6                -> rw-
5                -> r-x
4                -> r--
755              -> scripts and folders
644              -> normal files
600              -> SSH keys and secrets
777              -> never (everyone can do everything)
```
