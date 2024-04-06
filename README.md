# Scale Service
Simple back-end service to demonstrate handling queues of background jobs.

Instead of having to wait, an id is returned that can be used to query that status of the job.

## Get Started

```bash
git clone git@github.com:dayvidwhy/scale-service.git
cd scale-service
npm i
npm run start:dev
```

## Development
```bash
# Start the dev container
docker compose up --build

# Open a container shell
docker exec -it scale-service bash
```

## Production scaling testing
 A `docker-compose.yml` file is provided to scale the local environment for testing.

Working with docker swarm we can scale up the number of containers and load balance between them. 

We can then leverage [postman performance testing](https://blog.postman.com/postman-api-performance-testing/) to do a small scale load test of our service.
```bash
# Initiate the swarm
docker swarm init

# build and deploy the app
docker build -t dayvidwhy/scale-service:tag .

# docker stack deploy does not read in the .env file during startup 
# so we instead use another script that executes the necessary command:
# docker stack deploy -c docker-compose-scale.yml scale-service
node deploy.mjs scale-service

# clean up and leave when finished
docker stack rm scale-service
docker swarm leave --force
```

## Adding more modules
Run the following commands replacing [moduleName] with the intended name.
```bash
npx @nestjs/cli generate module [moduleName]
npx @nestjs/cli generate service [moduleName]
npx @nestjs/cli generate controller [moduleName]
```
The new module will be available in `./src/[moduleName]`.

## Test
```bash
npm run test
npm run test:e2e
npm run test:cov
```
