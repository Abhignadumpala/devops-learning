# wget vs curl: Downloading & Talking to URLs

## wget (download files from the internet)

```
wget <url>                 -> download the file into current folder
wget -O myfile.zip <url>   -> download and save with a different name (capital O)
wget -P /tmp <url>         -> download into a specific folder
wget -c <url>              -> continue a download that stopped in the middle
wget -q <url>              -> quiet mode, no progress output
wget -b <url>              -> download in background
wget -i urls.txt           -> download all links listed inside urls.txt
```

Example:

```
wget https://nginx.org/download/nginx-1.26.2.tar.gz   -> downloads nginx source file
```

## curl (talk to a URL / API, shows output on screen by default)

```
curl <url>                                       -> show the webpage/API response on the screen
curl -o myfile.html <url>                        -> save output into a file with the name I give (small o)
curl -O <url>                                    -> save output with the same name as in the URL (capital O)
curl -I <url>                                    -> show only headers (status code, server, content-type)
curl -L <url>                                    -> follow redirects (if site moved to another URL)
curl -s <url>                                    -> silent mode, no progress bar
curl -v <url>                                    -> verbose, shows full request/response details (good for troubleshooting)
curl -u user:password <url>                      -> send username and password
curl -X POST <url>                               -> send a POST request (default is GET)
curl -H "Content-Type: application/json" <url>   -> send a header
curl -d '{"name":"abhi"}' <url>                  -> send data in the request body
```

Example:

```
curl -X POST -H "Content-Type: application/json" -d '{"task":"learn linux"}' http://localhost:3000/tasks
-> send JSON data to my app API
```

## curl with pipe |

```
curl -s <url> | grep -i title                                        -> fetch page and search for "title"
curl -s https://api.github.com/users/Abhignadumpala | grep -i repos  -> check repo count from GitHub API
curl -I https://google.com | grep -i http                            -> check only the status code line
```

## Real DevOps use cases

```
curl localhost:80                                 -> check if nginx/app is running on the server
curl -I localhost:8080                            -> check if app returns 200 OK
curl http://169.254.169.254/latest/meta-data/     -> EC2 instance metadata (IMDSv1; newer instances need a token with IMDSv2)
curl ifconfig.me                                  -> find public IP of the server
wget <url-of-script> && bash script.sh            -> download and run an install script
```

## Simple way to remember the difference

```
wget -> "web get", main job is downloading files, saves to disk by default
curl -> "client URL", talks to URLs/APIs, shows output on screen by default
        supports GET, POST, PUT, DELETE, headers, data -> used for API testing

wget -O -> save with my name (capital O)
curl -o -> save with my name (small o)
curl -O -> save with URL's name (capital O)
```
