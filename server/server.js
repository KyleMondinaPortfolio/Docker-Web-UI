const express = require("express");
const socket = require("socket.io");
const  Docker  = require("dockerode");

const docker = new Docker({socketPath:'/var/run/docker.sock'});

//Set up the http server
const PORT = 5000;
const HOST = '0.0.0.0';
const app = express();

app.get("/containers", (req,res)=>{
	docker.listContainers({all:"true"},(err,containers)=>{
		if (err){
			console.log(err);
		}else{
			res.json(containers);
		}
	});
})

const server = app.listen(PORT,HOST, ()=>{
	console.log(`${HOST} server Running: listening on port ${PORT}`);
});





