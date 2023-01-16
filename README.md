# Docker Containers Monitor
Docker Containers Monitor provides the user a web interface to quickly monitor, control, and view the logs and statistics of docker containers. Docker Containers Monitor is run as a docker container itself. It accesses its sibling containers by having the docker socket mounted when the container is launched

## Setup
### Installation
```sh
  git clone https://github.com/KyleMondinaPortfolio/Docker-Web-UI
```
### Building the Docker Image
```sh
  cd server
  docker build . -t <image tag>
```
### Running with Docker
```sh
  docker run -d -p <port>:5000 -v /var/run/docker.sock:/var/run/docker.sock <image tag>
```

## Usage
### Monitor and Control Monitors
```
Default page displays all docker containers as well as their status
```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/monitor.gif)

```
By selecting a container, user can either start, stop, or delete the container depending on its state

 * exited or created containers can either be stopped or deleted
 * running containers can be stopped

```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/selecting.gif)

```
User can select multiple containers that share the same state 
and can perform bulk actions with them
```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/bulkselecting.gif)

### Container Information
```
User can view further information of a container such as 
image id, path, etc by clicking the container name
```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/info.gif)

### Container Logs
```
By clicking the logs tab, user can view the logs of a container
```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/logs.gif)

### Container Statistics
```
By clicking the statistics tab, user can view container statistics such as 
cpu usage from the start of loading the statisis page. 
By clicking the download button, user recieves a txt file containing all 
the data samples from the start of loading the statisics page
```
![](https://github.com/KyleMondinaPortfolio/Docker-Web-UI/blob/main/statistics-1.gif)
