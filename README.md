## Back ground
This is very simple api for demo pipeline

## Tech stack
- Java 17
- SpringBoot 3
- Postgres
- Docker

### Local Setup
1. Please set up git hooks first
```shell
git config --local core.hooksPath config/git-hooks  
```
2. Run build
```
./gradlew clean build
```
3. Start app
- using command line
  ```
  ./gradlew bootRun
  it will start the postgres docker container automatically
  if you did not have docker installed, please refer to docker folder to install it first
  ```
- start from Intellij: if the postgres container is not running, then you may have to start up 
  the container manually first, please refer to `docker/Docker-Colima-Setup.MD`
- access swagger ui: http://localhost:8080/swagger-ui/index.html
4. Commit message format
```text
[TECH][Name] feat: commit description
```
### CI CD
We are using  github actions as our pipeline, we pushed the docker image to AWS ECR and deploy the service
to AWS EKS, regarding how to get AWS access and how to set up AWS CLI, please refer to `infra/aws-cli-setup.MD`

### Smoke Test
We are using cypress to do the smoke test, for details, please refer to `smoke-test/README.md`

