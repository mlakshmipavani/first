# README
This repo contains the yolobots' site, available @ https://stayyolo.com

## Prerequisites
- Install [docker](https://docs.docker.com/engine/installation/linux/ubuntulinux/)
- Install [docker-machine](https://docs.docker.com/machine/install-machine/)
- Install [docker-compose](https://docs.docker.com/compose/install/)

## How to run locally?
Use `docker-compose` to build the image and run the container
```sh
> docker-compose up
# here you can see the logs
```

## How to push image for production?
After you run `docker-compose up` or `docker-compose build`, the image is generated and named as `site_site`.

Tag the image to `docker.yolosfalcon.com/site` as `docker.yolosfalcon.com` is StayYolo's private docker registry
```sh
> docker tag site_site docker.yolosfalcon.com/site
```

Login to private docker registry
```sh
> docker login docker.yolosfalcon.com
# enter username/password
```

Push the image
```sh
> docker push docker.yolosfalcon.com/site
```

## How to deploy on Azure?
Check if you have a docker machine running on Azure with the name `yolo-site`
```sh
> docker-machine ls
```

It should give you an output similar to this
```sh
NAME            ACTIVE   DRIVER       STATE     URL                                     SWARM   DOCKER    ERRORS
yolo-site       *        azure        Running   tcp://yolo-site.cloudapp.net:2376               v1.10.3
```

If it doesn't give you a machine named `yolo-site`, then use `deploy-machine` repo to deploy `yolo-site` machine.

Make sure you have the below port configuration on the VM in Azure

| Public Port | Private Port |
| ----------- | ------------ |
| 80 | 3000 |
| 443 | 5000 |

Going forward we'll assume that you have a machine named `yolo-site`.

SSH into the machine, and login to docker private registry
```sh
> docker-machine ssh yolo-site # you need to be in the deploy-machine dir for this to work

> sudo docker login docker.yolosfalcon.com
# enter username/password

> exit
```

Now connect to the remote docker-engine, and run the container
```sh
> eval $(docker-machine env yolo-site)
# now all the docker commands run in this instance of shell will be run on the remote docker engine

> docker-compose -f docker-compose.yml -f production.yml up -d
```

The `production.yml` is the file which contains production configuration for the container, get it from jaydp17's BitBucket snippets


## How to redeploy?
Just as mentioned in the deployment steps, build the new image and push it to private docker registry

Then connect to remote docker-engine
```sh
> eval $(docker-machine env yolo-site)
```

Pull the updated image
```sh
> docker-compose -f docker-compose.yml -f production.yml pull
```

Restart the service
```sh
> docker-compose -f docker-compose.yml -f production.yml up -d
```

## Troubleshooting
While running any command on the remote `docker-engine` from `docker-compose`, make sure you use specify all the docker-compose files
```sh
> docker-compose -f docker-compose.yml -f production.yml [COMMAND] [OPTIONS]
```
