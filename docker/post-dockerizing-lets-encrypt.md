## Motivation

The problem we faced was to came to a simple and maintainable way to enabled HTTPS on our applications. We decided to keep it simple and free combining the power of Docker and Let's Encrypt CA.

Let’s Encrypt is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the Internet Security Research Group (ISRG).

## Getting Started

To follow this tutorial, you will need:

- Linux host machine, with Nginx and Docker installed.
- SSH access to that host.
- An application running on Docker, to which we will add the certificate.
- Registered domain name.

## Setting Nginx Configurations

In order to get a certificate for our application's domain from Let’s Encrypt, we need to demonstrate control over the domain. Our way to do this is to pointing the domain name to where the host and placing there proper configurations to attend incoming requests.

Once the domain is pointing to the host. Inside the host we go to:

```bash
cd /etc/nginx/sites-available
```

There we create/edit the nginx configuration file for our application this way:

```bash 
touch application-name
```

Next we edit this file, placing the following configuration:

```bash
nano application-name

server {
    listen       80;
    server_name  domain;

    location ~ /.well-known {
        allow all;
        root /var/www/html/shared;
    }

    location / {
        proxy_pass   http://localhost:3000/;
    }
}
```

This configuration is highly related to our particular structure, very common though. Inside our host we have Nginx installed listen on port 80. Also we have a docker container runing our application as an image. This docker container listen on port 3000, that's way we have the proxy_pass configuration, to route every request that came trought port 80 to that domain to our application container. Finally we set proper configuration to well-know path, to verify our domain control with Let's Encrypt.

NOTE: we can easily scale this to have multiple applications running on multiple docker containers, each one will need to have their own nginx configuration.

## Getting the Certificate

In order to get the certificate we will connect with SSH to the host machine.

Once inside, we will run a docker image called lojzik/letsencrypt using the following command:

```bash
$ docker run --rm -it -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt certonly --webroot --webroot-path /var/www --email EMAIL -d domain
```

What we are doing here is running Certbot to get the certificate inside a Docker container built with the lojzek/letsencrypt image. Also with the -v flag, we are sharing between our host enviroment and the container one some folders to persist the work Certbot is doing. Without this,the certificates, logs etc. will be created inside the container, but once Certbot finish executing we will lose it all. Finally, we must provide an email and, of course, the domain for which we want the certificate.

As we are running just a command, and it will be finish after some time, docker will stop the container after, to keep things clean we also include the --rm flag, to delete the container.

NOTE: Let's Encrypt doesn't allow us to get a certificate to all our subdomain's names at once. We can't replace domain for *.domain. So we need to indicate every subdomain in the command separated by a comma, or runing the command multiple times one for each subdomain we want to protect.

## One more Nginx Configuration

Now that we have our certificate, we need to add one more configuration to Nginx, as we did it before.

```bash
nano /etc/nginx/sites-available/aplication-name
```

```bash
server {
    listen       443 ssl;
    server_name  domain;

    ssl_certificate     /etc/letsencrypt/live/domain/fullcha$
    ssl_certificate_key /etc/letsencrypt/live/domain/privkey$
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    location / {
        proxy_pass   http://localhost:3000/;
    }
}
```

This configuration tells Nginx to listen on port 443. And indicates the path to the certificate we just got by running the previous command. We also need to add the proxy_pass configuration for the same reason we do before.

## Renewal

Another particularity of Let's Encrypt is that the certificates we obtein expires after ninety days. But is free, what else can we expect? Fortunately, this is not a problem, since we can craft a command to do renewal, and next set to cron, so we don't have to remember running it.

The following command is very similar to the one we used to obtain the certificate. Here we also have to share folders where Certbot will place our certificate, logs, etc. The main difference is that now we only have to execute the renew command.

```bash
docker run --rm -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt renew
```

Instead of executing the previous command immediately, we will create a cron to execute it every day. If the certificate is still valid, the Certbot will not do anything. If it expired, you will get a new one. Also we need to reload nginx to apply the changes.

```
0 0 * * * docker run --rm -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt renew >> /var/log/certbot.log 2>&1 && service nginx reload >> /var/log/certbot.log 2>&1
```

NOTE: We are saving the output to know how it goes, this is not mandatory but recommended.

## Conclusion

So that's all. If you got to this point, you got a simple, maintainable, scalable and even free way to enable HTTPS for your applications, whithout having to install any extra software directly on your host machine (becase we are using docker for this). Note that this gives you independecy over what your using to host you application. And if that changes tomorrow, only thing you need is to get back to this post and following the exact same steps.