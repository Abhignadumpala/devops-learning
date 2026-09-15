# Docker Interview Questions & Answers

Based on the hands-on project: a Node.js HTTP server packaged and run in Docker.
See [`README.md`](README.md) for the full walkthrough these answers are based on.

---

### Q1: What is Docker, in simple terms?

Docker is a containerization technology. It packages an application together with everything it needs to run — runtime, dependencies, OS-level tools — into a single unit called an image. The main problem it solves is "it works on my machine but not on the server." Because the image contains everything, it behaves the same on any machine that runs Docker.

---

### Q2: What is a Docker image?

An image is a blueprint — a read-only template built from a `Dockerfile`. It contains the base OS/runtime, your application code, and dependencies. It doesn't run by itself; it's just stored on disk until you create a container from it.

---

### Q3: What is a Docker container?

A container is a running instance of an image. It's the live, active process — with its own filesystem, network, and process space — created from the image's blueprint. You can start multiple containers from the same image.

---

### Q4: What's the difference between an image and a container?

| Image | Container |
|---|---|
| Blueprint / template | Running instance |
| Static, stored on disk | Dynamic, actually executing |
| Built once | Can be started/stopped many times |
| Analogy: a recipe | Analogy: the cooked meal |

---

### Q5: Explain the `COPY . .` instruction in a Dockerfile.

It copies files from the build context (your project folder on the host machine) into the container's filesystem.
- The first `.` refers to the current directory on your machine (where the Dockerfile lives).
- The second `.` refers to the current working directory *inside* the container (set earlier by `WORKDIR`).

This is the step that gets your actual application code inside the image — without it, the container would have no code to run.

---

### Q6: What does `WORKDIR` do?

It creates (if needed) and sets a directory inside the container as the "current directory" for every instruction that follows (`COPY`, `RUN`, `CMD`, etc.). It's the equivalent of running `mkdir` and `cd` combined.

---

### Q7: What does `RUN npm install` do, and why is it needed even if there are no dependencies?

It executes `npm install` inside the container during the build, reading `package.json` and installing any listed dependencies into a `node_modules` folder. Even with zero dependencies, it's standard practice for Node.js projects — and it's exactly where real dependencies (like `express`) would be installed if the app needed them.

---

### Q8: What does `EXPOSE 3000` actually do?

It documents which port the application listens on inside the container. It does **not** open that port to the outside world by itself — actual access requires port mapping via `docker run -p`.

---

### Q9: What does `CMD ["node", "app.js"]` do?

It sets the default command that runs automatically whenever a container is started from this image. In this project, it's equivalent to typing `node app.js` — it's how the server actually starts when the container launches.

---

### Q10: Walk me through what `docker build -t my-app:1.0 .` does.

1. Docker reads the `Dockerfile` in the current directory.
2. It pulls the base image (`node:16-alpine`) if not already cached.
3. It creates the working directory inside the container.
4. It copies the project files in.
5. It runs `npm install` inside the container.
6. It records the exposed port and the startup command.
7. It saves the result as a new image, tagged `my-app:1.0`, stored locally.

---

### Q11: Walk me through what `docker run -p 3000:3000 my-app:1.0` does.

1. Docker creates a new container from the `my-app:1.0` image.
2. It starts the container, which triggers the `CMD` instruction (`node app.js`).
3. The Node.js server starts listening on port 3000 *inside* the container.
4. The `-p 3000:3000` flag maps port 3000 on the host machine to port 3000 inside the container, so requests to `localhost:3000` reach the server.

---

### Q12: What does the port mapping `-p 3000:3000` mean? What if the numbers are different?

The format is `-p <host-port>:<container-port>`. The host port is what you type in your browser; the container port is what the app actually listens on inside the container. They don't have to match — `-p 8080:3000` would mean visiting `http://localhost:8080` reaches a server listening on port 3000 inside the container.

---

### Q13: What is inside the Docker image after building this project?

- The Node.js runtime (from the base image)
- The application code (`app.js`, `package.json`)
- Installed dependencies (`node_modules`, even if empty here)
- Minimal Linux OS tools (from Alpine)

---

### Q14: Why use `node:16-alpine` instead of a full `node:16` image?

Alpine is a minimal Linux distribution, so the resulting image is much smaller (tens of MB vs. hundreds of MB) compared to the full Debian/Ubuntu-based Node image. Smaller images build faster, transfer faster, and have a smaller attack surface — at the cost of occasionally missing OS packages that some native dependencies need.

---

### Q15: What is the HTTP module used for in `app.js`, and why does it matter?

`require('http')` loads Node's built-in module for handling the HTTP protocol — the language browsers and servers use to communicate. It's what lets `app.js` listen for incoming requests and send back properly formatted responses. Without it, there's no way for a browser to talk to this code at all.

---

### Q16: What's the difference between a web server and an app server? Which one is `app.js`?

- A **web server** listens for incoming HTTP requests and routes them.
- An **app server** runs application logic and produces the actual response.

`app.js` does both jobs at once — it listens on port 3000 *and* generates the response. Small apps commonly combine both roles. Larger systems (e.g., Netflix, Facebook) separate them: a dedicated web server (like Nginx) handles incoming traffic and forwards it to separate app servers, which lets each layer scale independently.

---

### Q17: Why does a Node.js project need `package.json` even for a dependency-free app?

`package.json` is the standard descriptor Node.js and npm use to identify a project — its name, version, entry point, scripts, and dependencies. Docker's build process runs `npm install`, which requires this file to exist. It's also where any future dependencies would be declared.

---

### Q18: How would this same workflow look in a real production deployment?

1. A developer writes and commits application code.
2. A `Dockerfile` defines how to build it into an image.
3. A CI/CD pipeline runs `docker build` and pushes the image to a registry (Docker Hub, AWS ECR, etc.).
4. A production server or orchestrator (e.g., Kubernetes) pulls that image and runs it with `docker run` or equivalent.
5. End users access the running application over the internet.

The key benefit: the exact same image is used at every stage, so behavior is consistent from a developer's laptop through to production.

---

### Q19: How would you scale this app to handle a large number of users?

Start by running multiple containers behind a load balancer. At larger scale: separate web servers (e.g., Nginx) from app servers, add a caching layer (e.g., Redis), use a database cluster instead of a single instance, and use a container orchestrator like Kubernetes to automatically manage scaling, restarts, and health checks across many containers.

---

### Q20: What does `docker ps` vs `docker ps -a` show?

`docker ps` lists only currently running containers. `docker ps -a` lists all containers, including stopped ones, along with their exit status (e.g., `Exited (0)` meaning it stopped cleanly).
