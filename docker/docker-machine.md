# Docker Machine #

The problem to solve here is, being able to deploy and run a docker image without necessary having to push your built image into a Docker repository (e.g Docker Hub).

First we will need to grasp what a Docker Machine is.
A Docker Machine is a tool that allows you to install and manage multiple remote Docker Engine on virtual hosts.

Using the `docker-machine` commands, you can start, inspect, stop, and restart a managed host, upgrade the Docker client and daemon, and configure a Docker client to talk to your host.

### Why would I want to use Docker Machine? ####

You can use `docker-machine` commands to provision and manage large numbers of Docker hosts **remotely**  (as when you use Machine to provision Dockerized hosts on cloud providers). We install Docker Engine on one or more virtual systems and remotely build and run images on them.

### Using Machine to create Droplet on Digital Ocean ###

```
docker-machine create --driver digitalocean --digitalocean-access-token <TOKEN_HERE>
```

### How do I access to the Machine via SSH ? ###

When the Droplet is created, Docker generates a unique SSH key and stores it on your local system in `~/.docker/machines`.  
Later, it’s used under the hood to access the Droplet directly with the `docker-machine ssh <MACHINE NAME>` command. Docker Engine is installed on the cloud server and the daemon is configured to accept remote connections over TCP using TLS for authentication.

To see all your machines run `docker-machine ls`, the __*__ in the **ACTIVE** column means the machine is running.


## Build and run an image on a remote Machine ##

```
# Build (the '.' is for ./Dockerfile)
docker `docker-machine config <MACHINE NAME>` build -t <IMAGE NAME> .

# Run
docker `docker-machine config <MACHINE NAME>` run -p <hostPort>:<containerPort> -dit <IMAGE NAME>


```


### Some other basic commands ###
```
# show the active "machine" (the default one)
docker-machine active

# displaying a complete list of details
docker-machine inspect <MACHINE NAME>

# display the docker-client connection details for a machine
docker-machine config <MACHINE NAME>

# removing a machine
docker-machine rm <MACHINE NAME>
```


#### TO KNOW MORE: ####

https://docs.docker.com/machine/examples/ocean/

https://docs.docker.com/machine/concepts/

https://developer.rackspace.com/blog/using-docker-machine-to-deploy-your-docker-containers-on-rackspace/

https://github.com/docker/machine/issues/2879