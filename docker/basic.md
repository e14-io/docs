# Docker

## What is docker?

Docker is an open source project that automates the deployment of applications within software containers, offering an additional layer of abstraction and automation of virtualization at the operating system level in Linux.

Docker enables true independence between applications and infrastructure and developers and IT ops to unlock their potential and creates a model for better collaboration and innovation.

Eliminate the “works on my machine” once and for all.

### Image

A container image is a lightweight, stand-alone, executable package of a piece of software that includes everything needed to run it: code, runtime, system tools, system libraries, settings. 

### Containers

A container is a runtime instance of an image—what the image becomes in memory when actually executed. It runs completely isolated from the host environment by default, only accessing host files and ports if configured to do so.

Containers are a way to package software in a format that can run isolated on a shared operating system. Unlike VMs, containers do not bundle a full operating system - only libraries and settings required to make the software work are needed. This makes for efficient, lightweight, self-contained systems and guarantees that software will always run the same, regardless of where it’s deployed.

## Install

https://docs.docker.com/docker-for-mac/install/#download-docker-for-mac


### Dockerfile

Dockerfile will define what goes on in the environment inside your container. Access to resources like networking interfaces and disk drives is virtualized inside this environment, which is isolated from the rest of your system, so you have to map ports to the outside world, and be specific about what files you want to “copy in” to that environment. However, after doing that, you can expect that the build of your app defined in this Dockerfile will behave exactly the same wherever it runs.

```sh
    # You should always specify a full version here to ensure all of your developers
    # are running the same version of Node.
    FROM node:8.9.0

    # Install and configure `pm2`.
    RUN npm install pm2 -g

    # Install all dependencies of the current project.
    COPY package.json package.json
    RUN npm install

    # Copy all local files into the image.
    COPY . .

    # Make port 3000 available to the world outside this container
    EXPOSE 3000

    # Run pm2 start when the container launches
    CMD ["pm2", "start", "processes.json", "--no-daemon"]

```

### Build the app

```sh
    docker build -t node-todo-api .
```

### Run the app

```sh
    docker run -d -p 4000:3000 node-todo-api
```

`-it` interactivo y con TTY

`-p 4000:3000` Exposes port 4000 locally, internally it will go through the port 3000.

`-d` Run the container in the background and print your container ID.

### Containers running

```sh
    docker ps
```

### All Containers

```sh
    docker ps -a
```

### Stop a container

```sh
    docker stop container_id
```

### Start a container

```sh
    docker start container_id
```

### Delete a container

```sh
    docker rm container_id
```




