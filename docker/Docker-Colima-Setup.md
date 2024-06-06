### Background
As docker desktop is not free anymore, so we find colima as a replacement for docker desktop.
Below the steps to set up docker and colima in local

1. install docker, docker-compose and colima:
```
brew install docker docker-compose colima
```
2. in the controller end to end test, we will start a postgres
container for testing, it will fail due to could not find docker, 
ro resolve this issue, you have to add below link
```
sudo ln -s $HOME/.colima/docker.sock /var/run/docker.sock
```
3. start colima:
```
colima start
```
4. verify docker is working fine by list all the running containers
```
docker ps
```
5 start the postgres
```
docker compose -f docker/docker-compose-postgres.yml up -d
```