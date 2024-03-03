# Python + React Time Tracker

Ingredients:

* AWS Cognito user Pool
* Postgres DB

The following are the environment variables expected:

see .devcontainer/devcontainer.env.bak


## Installing Locally 

Thanks to `setup.py` from the root directory, i can install the app in order to run tests without changing imports

`pip install -e ./`


### Commands for building and deploying:

docker build --tag pyre-time .
docker tag pyre-time:latest pyre-time:0.0.2
docker tag pyre-time:0.0.2 container-registry.url/pyre-time:0.0.2

(If running on amd, wanting to push to x86)
(docker buildx create --use)
docker buildx build --platform linux/arm,linux/amd64 -t docker.io/izzlenizzle/pyre-time:0.0.1 --push .

docker push container-registry.url/pyre-time:0.0.2


XC Tasks: https://github.com/joerdav/xc

## Tasks

### main-build-push-test-env
Builds,tags,pushes to remote
Requires: build-test-image, tag-test-image-remote, push-test-image-remote, caprover-deploy-test


### build-test-image
Build Docker Image
```sh
docker build --pull --rm -t python-react-time-tracker-server:latest .
```

### tag-test-image-remote
Tags local image with remote name

```sh
docker tag python-react-time-tracker-server:latest $REGISTRY_ADDRESS/python-react-time-tracker-server:latest
```

### push-test-image-remote
Pushes local image to remote

```sh
docker push $REGISTRY_ADDRESS/python-react-time-tracker-server:latest
```

### caprover-deploy-test
Sends signal to Caprover deployment for this app

```sh
caprover deploy --imageName $REGISTRY_ADDRESS/python-react-time-tracker-server:latest
```
