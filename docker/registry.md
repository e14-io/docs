# Regitry

A registry is a collection of repositories, and a repository is a collection of images—sort of like a GitHub repository, except the code is already built. An account on a registry can create many repositories. The docker CLI uses Docker’s public registry by default.

### Create an acount on docker-hub

https://hub.docker.com/

### Login

```sh
docker login
```

### Tag the image

```sh
docker tag image username/repository:tag
```

For example:

```sh
docker tag node-todo-api stabarez/node-todo-api:master
```

### Publish the image

```sh
docker push username/repository:tag
```

For example

```sh
docker push stabarez/node-todo-api:master
```