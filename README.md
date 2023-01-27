# Python + React Time Tracker

Ingredients:

* AWS Cognito user Pool
* Postgres DB

The following are the environment variables expected:


```
DB_NAME=postgres
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_PORT=5432
FLASK_SESSION_SECRET=secret
LOGIN_URL=https://{{COGNITO_APP_DOMAIN}}.auth.{{COGNITO_APP_REGION}}.amazoncognito.com/login?client_id={{COGNITO_CLIENT_ID}}&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri={{REDIRECT_URL}}
COGNITO_APP_DOMAIN=
COGNITO_APP_REGION=us-east-1
COGNITO_USERPOOL_ID=us-east-1_*******
COGNITO_CLIENT_ID=
COGNITO_CLIENT_SECRET=
REDIRECT_URL=
ENVIRONMENT=develop|production
```

### Commands for building and deploying:

docker build --tag pyre-time .
docker tag pyre-time:latest pyre-time:0.0.2
docker tag pyre-time:0.0.2 container-registry.url/pyre-time:0.0.2

(If running on amd, wanting to push to x86)
(docker buildx create --use)
docker buildx build --platform linux/arm,linux/amd64 -t container-registry.url/pyre-time:0.0.2 --push .

docker push container-registry.url/pyre-time:0.0.2
