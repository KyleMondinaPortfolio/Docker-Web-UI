#Docker Containers Monitor
Docker Containers Monitor provides the user a web interface to quickly monitor, control, and view the logs and statistics of docker containers. Docker Containers Monitor is run as a docker container itself. It accesses its sibling containers by having the docker socket mounted when the container is launched

##Setup
###Installation
```sh
  git clone https://github.com/KyleMondinaPortfolio/Docker-Web-UI
```
###Building the Docker Image
```sh
  cd server
  docker build . -t <image tag>
```
###Running with Docker
```sh
  docker run -d -p <port>:5000 -v /var/run/docker.sock:/var/run/docker.sock <image tag>
```

##Usage
###Monitor and Control Monitors
Default page displays all docker containers as well as their status
###Container Information
###Container Logs
###Container Statistics
