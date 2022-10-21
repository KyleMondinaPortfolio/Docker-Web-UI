const express = require("express");
const socket = require("socket.io");
const { exec } = require("child_process");

//Set up the http server
const PORT = 3000;
const app = express();
const server = app.listen(PORT, ()=>{
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

const docker_ps = ()=>{
	exec(" sudo docker ps  --format '{{.ID}},{{.Names}},{{.Image}},{{.Status}}'", (error, stdout, stderr)=>{
		if (error){
			console.log("error: " + error.message);
		}
		if(stderr){
			console.log("stderr: " + stderr);
		}
		console.log(stdout.toString());
		io.emit("container-data",stdout.toString());
	});

}

//socket io logic
io.on("connection", (socket)=>{
	console.log(`socket ${socket.id} established a connection`);
	socket.on("display-containers", (msg)=>{
		console.log("button has been clicked");
		docker_ps();
		
	});
	socket.on("stop-container", (msg)=>{
		console.log(msg + " called to stop");
		exec(`sudo docker stop ${msg}`, (error, stdout, stderr)=>{
			if (error){
				console.log("error: " + error.message);
			}
			if(stderr){
				console.log("stderr: " + stderr);
			}
			docker_ps();
		});
	});
	



});

