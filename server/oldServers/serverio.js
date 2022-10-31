const express = require("express");
const socket = require("socket.io");
const  Docker  = require("dockerode");

const docker = new Docker({socketPath:'/var/run/docker.sock'});

//Set up the http server
const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
const server = app.listen(PORT,HOST, ()=>{
	console.log(`Server Running: listening on port ${PORT}`);
});
app.use(express.static("static"));

//set up io socket
const io = socket(server,{
	cors:{
		origin:"http://localhost:3000",
		methods:["GET", "POST"],
		transports:['websocket', 'polling'],
		credentials:true
	},
	allowEIO3:true
});

const send_containers = ()=>{
	docker.listContainers({all:"true"},(err,containers)=>{
		io.emit("containers-sent",containers);
	});
}
const start_container = (id)=>{
	const container = docker.getContainer(id);
	container.start((err,data)=>{console.log(data)})
	docker.listContainers({all:"true"},(err,containers)=>{
		io.emit("containers-sent",containers);
	});
}
const stop_container = (id)=>{
	const container = docker.getContainer(id);
	container.stop((err,data)=>{console.log(data)})
	docker.listContainers({all:"true"},(err,containers)=>{
		io.emit("containers-sent",containers);
	});
}
const delete_container = (id)=>{
	const container = docker.getContainer(id);
	container.remove((err,data)=>{console.log(data)})
	docker.listContainers({all:"true"},(err,containers)=>{
		io.emit("containers-sent",containers);
	});
}



//socket io logic
io.on("connection", (socket)=>{
	console.log(`socket ${socket.id} established a connection`);
	socket.on("request-containers",send_containers);
	socket.on("start-container",start_container);
	socket.on("stop-container",stop_container);
	socket.on("delete-container",delete_container);
});

