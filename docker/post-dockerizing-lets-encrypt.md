## Motivation

The problem we faced was to came to a simple and maintainable way to enabled HTTPS on our applications. We decided to keep it simple and free combining the power of docker and let's encrypt CA.

## Getting Started

To follow this tutorial, you will need:

- Linux host machine, with nginx and docker installed.
- SSH access to that host.
- An application running on docker, to which we will add the certificate.
- Registered domain name.

## Obtaining the certificate

In order to get the certificate we will connect with SSH to the host machine.

Once inside, we will run a docker image called lojzik/letsencrypt using the following command:

```bash
$ docker run --rm -it -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt certonly --webroot --webroot-path /var/www --email EMAIL -d domain
```

What we are doing here is running Certbot to get the Certificate inside a docker container built with the lojzek/letsencrypt image. Also with the -v flag, we are sharing between our host enviroment and the container one some folders to persist the work Certbot is doing. Without this,the certificates, logs etc. will be created inside the container, but once Certbot finish executing we will lose it all. Finally, we must provide an email and, of course, the domain for which we want the certificate.

NOTE: Let's encrypt doesn't allow us to get a certificate to all our subdomain's names at once. We can't replace domain for *.domain. So we need to indicate every subdomain in the command spread by a comma, or runing the command multiple times to every subdomain we want to protect.

As we are running just a command, that will finish after some time, docker will stop the container after, to keep things clean we also include the --rm flag, to delete the container.

## Renewal

Another particularity of Let's Encrypt is that the certificates expire after ninety days. But is free, what else we expect? Fortunately this is not a problem, since we can craft a command to do renewal, and next set a cron, so we don't need to remember running it.

The following command is very similar to the one we used to obtain the certificate. Here we also have to share folders where Certbot will place our certificate, logs, etc. The main difference is that now we only have to execute the renew command.

```
docker run --rm -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt renew
```

Instead of executing the previous command immediately, we will create a cron to execute it every day. If the certificate is still valid, the Certbot will do nothing. If it expired, you will get a new one. We need to reload nginx to apply the changes.

```
0 0 * * * docker run --rm -v "/root/letsencrypt/log:/var/log/letsencrypt" -v "/var/www/html/shared:/var/www/" -v "/etc/letsencrypt:/etc/letsencrypt" -v "/root/letsencrypt/lib:/var/lib/letsencrypt" lojzik/letsencrypt renew >> /var/log/certbot.log 2>&1 && service nginx reload >> /var/log/certbot.log 2>&1
```
