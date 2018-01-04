# Services

In a distributed application, different pieces of the app are called “services.”
For example, if we have a website composed of a front-end application, a back-end API and a database. Each one of them are a service.

Services are really just “containers in production.” A service only runs one image, but it codifies the way that image runs—what ports it should use, how many replicas of the container should run so the service has the capacity it needs, and so on. Scaling a service changes the number of container instances running that piece of software, assigning more computing resources to the service in the process.

To define, run and scale services using docker we write a docker-compose.yml file.

The simplest docker-compose file:

```sh
version: '3'
services:
    mongo:
      image: mongo
      ports:
          - "27017:27017"
    node-todo-api:
        build: .
        depends_on:
            - mongo
        links:
            - mongo
        ports:
            - "3000:3000"
```

Another a little bit more complex: 

```sh
version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: username/repo:tag
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "80:80"
    networks:
      - webnet
networks:
  webnet:
```

This docker-compose.yml file tells Docker to do the following:

- Pull the image username/repo:tag
- Run five instances of that image as a service called web, limiting each one to use, at most, 10% of the CPU (across all cores), and 50MB of RAM.
- Immediately restart containers if one fails.
- Map port 80 on the host to web’s port 80.
- Instruct web’s containers to share port 80 via a load-balanced network called webnet. (Internally, the containers themselves will publish to web’s port 80 at an ephemeral port.)
- Define the webnet network with the default settings (which is a load-balanced overlay network).