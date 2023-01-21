### Commands for building and deploying:

docker build --tag pyre-time .
docker tag pyre-time:latest pyre-time:0.0.2
docker tag pyre-time:0.0.2 container-registry.url/pyre-time:0.0.2

(If running on amd, wanting to push to x86)
(docker buildx create --use)
docker buildx build --platform linux/arm,linux/amd64 -t container-registry.url/pyre-time:0.0.2 --push .

docker push container-registry.url/pyre-time:0.0.2
