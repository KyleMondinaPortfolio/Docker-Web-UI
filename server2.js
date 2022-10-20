const express = require("express");
const socket = require("socket.io");

const PORT = 3000;
const app = express();
const server = app.listen(PORT, ()=>{
	console.log(`Listening on port ${PORT}`);
});

app.use(express.static("static"));

/*let io = require('socket.io')

io.on("connection", (socket)=>{
	console.log("made socket connection");
})*/

const io = socket(server,{
	cors:{
		origin:"http://localhost:3000",
		methods:["GET", "POST"],
		transports:['websocket', 'polling'],
		credentials:true
	},
	allowEIO3:true;
});

io.on("connection", (socket)=>{
	console.log("made socket connection");
});

