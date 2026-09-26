Don't Start by Memorising Commands

#beginners #learning #linux

When I first started learning Linux, I thought I needed to remember a lot of commands.

ps, top, systemctl, journalctl, chmod, chown, grep, find...

The list kept growing.

But knowing what a command does is not always the same as knowing when to use it.

I could read that journalctl shows logs, but that didn't automatically tell me why I should check logs when a service fails. I knew chmod changes permissions, but that made much more sense once I actually saw a script return Permission denied.

What helped was connecting the commands to the things happening on the system.

A process is running. A service manages it. Logs help explain what happened. Files and configuration live in different parts of the filesystem. Permissions and ownership decide who can access them.

Once those pieces started connecting, the commands stopped feeling like random things I had to memorise.

So if you're learning Linux too, these are the things worth understanding first.

First, understand what's happening underneath

You don't need to go extremely deep into Linux internals at the beginning. But understanding a few basic pieces makes everything else easier.

A simplified view looks like this:

Applications
     ↓
Shell
     ↓
Kernel
     ↓
Hardware


The hardware is the physical machine: CPU, memory, storage and network interfaces.

The kernel is the core of Linux. It handles things like:

Processes
Memory
File systems
Communication with hardware


The shell is where you interact with the system using commands.

When you run:

ls


the shell interprets your command and asks the operating system to perform the required action.

So a simple way to think about it is:

You → Shell → Linux


That is already more useful than just memorising what ls does.

A program running is a process

A process is simply a program that is currently running.

Each process has a unique Process ID, or PID.

To see running processes:

ps aux


This is useful when you want to answer:



What's running on this machine?

If the system feels slow, you probably want to know which process is using resources.

For that:

top


top gives you a live view of processes along with CPU and memory usage.

To find a specific process:

ps aux | grep nginx


And if you already know the PID and want more details:

ps -p -o pid,ppid,command


This can help you see:





The process ID



Its parent process



The command used to start it

If a process needs to be stopped:

kill <PID>


And if it refuses to stop:

kill -9 <PID>


But force-stopping a process should not be the first thing you do. First understand what the process is and why it's running.



A service is not quite the same thing as a process

This was one of the concepts that helped things connect.



A process is something currently running.



A service is a program that the operating system manages.

For example, Nginx runs as one or more processes, but you usually manage it as a service.

On Linux systems using systemd, that means you can check its status:

systemctl status nginx


Start it:

sudo systemctl start nginx


Restart it:

sudo systemctl restart nginx


Enable it to start automatically after a reboot:

sudo systemctl enable nginx


And check whether it is enabled:

systemctl is-enabled nginx


The difference between these two is worth remembering:

start  → start the service now
enable → start the service automatically during boot


So if a web server isn't working, systemctl status nginx is often a much better starting point than randomly trying commands.



If something breaks, check what happened

This is where logs come in.

A service might fail because of:

A bad configuration
Missing files
Port conflicts
Permission issues
Dependency problems


Instead of guessing, check the logs.

For a service managed by systemd:

journalctl -u nginx


To see the latest entries:

journalctl -u nginx -n 50


To watch logs live:

journalctl -u nginx -f


Or to check recent activity:

journalctl -u nginx --since "10 min ago"


For normal log files:

tail -f /var/log/app.log


The important thing isn't memorising all the journalctl options.

It's remembering:

Service has a problem? Check its status. Then check its logs.


That simple flow already covers a lot of basic troubleshooting.



Know where to look

Linux has a standard filesystem structure, and knowing a few important locations can save you a lot of time.

Everything starts from:

/


Some directories you'll run into often are:

/home      → User home directories
/root      → Root user's home directory
/etc       → System and application configuration
/var/log   → Logs
/tmp       → Temporary files
/bin       → Essential commands
/usr/bin   → Common system commands and utilities
/opt       → Optional or third-party software


You don't need to memorise the entire filesystem hierarchy.

But knowing that:

configuration is often in /etc
logs are often in /var/log
user files are usually under /home


gives you a much better starting point when investigating something.

To see where you currently are:

pwd


To move around:

cd /var/log


To move back one directory:

cd ..


To list files:

ls


For more details:

ls -l


And to include hidden files:

ls -la




Disk full? Don't guess—find out what's using it

First, check the available disk space:

df -h


If you need to see how much space files or directories are using:

du -sh *


And if you suspect logs are growing:

du -sh /var/log/* 2>/dev/null | sort -h | tail -5


This checks the sizes of entries inside /var/log, sorts them, and shows the largest ones.

Again, the command is easier to remember when you connect it to the question:



What's using my disk space?

Files: create them, read them, change them

Creating a file:

touch notes.txt


Creating a directory:

mkdir projects


Creating nested directories:

mkdir -p project/app/logs


To read a file:

cat notes.txt


For a large file:

less notes.txt


To see the first few lines:

head -n 5 notes.txt


To see the last few:

tail -n 5 notes.txt


One small thing that is easy to forget:

echo "Hello" > notes.txt


> writes to the file by replacing its existing content.

But:

echo "Hello" >> notes.txt


adds the content to the end.

A simple reminder:

>   = overwrite
>>  = append


You can also use:

echo "Hello" | tee -a notes.txt


This writes to the file while also showing the output on the screen.



Permissions explain a lot of "Permission denied" errors

Linux permissions are based on three things:

r → read
w → write
x → execute


These permissions are applied to:

Owner | Group | Others


You can check them using:

ls -l


For example:

-rwxr-xr-x


can be read as:

Owner   → rwx
Group   → r-x
Others  → r-x


Permissions can be changed using chmod.

To make a script executable:

chmod +x script.sh


To remove write permission:

chmod -w file.txt


You can also use numeric permissions.

The values are:

read    = 4
write   = 2
execute = 1


So:

chmod 755 script.sh


means:

7 → read + write + execute
5 → read + execute
5 → read + execute


This becomes easier to understand when you actually see the result.

A script without execute permission:

./script.sh


can return:

Permission denied


Add execute permission:

chmod +x script.sh


and it can run again.

That one error teaches more about chmod than memorising the command definition ever will.



Permissions and ownership are different

Permissions answer:

What can people do with this file?


Ownership answers:

Who does this file belong to?


Every Linux file has an owner and a group.

You can check both using:

ls -l


For example:

-rw-rw-r-- 1 ubuntu developers file.txt


Here:

Owner → ubuntu
Group → developers


To change the owner:

sudo chown username file.txt


To change only the group:

sudo chgrp groupname file.txt


To change both:

sudo chown username:groupname file.txt


For an entire directory and everything inside it:

sudo chown -R username:groupname directory/


The -R means recursive.

The easiest way to remember these commands is:

chmod → changes permissions
chown → changes owner
chgrp → changes group


And after making changes:

ls -l


Always verify.



Don't just run commands. Verify what changed.

One thing that kept coming up while practising Linux was this:

Running a command doesn't mean the job is finished.

If you start a service:

sudo systemctl start nginx


check:

systemctl status nginx


If you change permissions:

chmod +x script.sh


check:

ls -l script.sh


If you change ownership:

sudo chown user:group file.txt


check:

ls -l file.txt


A good habit is:

Change something
      ↓
Check the result
      ↓
Test that it works


That habit is useful far beyond Linux.



The commands I would remember first

If I had to reduce everything down to a small set, I wouldn't try to remember commands alphabetically.

I'd remember them by the questions they help answer.

What's running?

ps aux
top


Is the service healthy?

systemctl status <service>


Why did the service fail?

journalctl -u <service> -n 50


What is using disk space?

df -h
du -sh *


Where am I and what's here?

pwd
ls -la


Who owns this file and what permissions does it have?

ls -l


Why can't I run this script?

ls -l script.sh
chmod +x script.sh


Where is this file?

find / -name "filename"


These aren't the only commands worth learning.

They're just a useful starting point because they answer real questions you are likely to ask.



Final thought

Linux started making more sense when I stopped treating commands like flashcards.

The command matters, but the problem behind it matters more.

Instead of trying to remember:

journalctl shows logs


I now think:

My service isn't working. What happened? Check the logs.


Instead of:

chmod changes permissions


I think:

This script says "Permission denied." Does it have execute permission?


Instead of:

du shows disk usage


I think:

The server is running out of space. What's taking it?


The commands eventually become easier to remember because you're connecting them to situations.

And I think that's a much better place to start when learning Linux.
