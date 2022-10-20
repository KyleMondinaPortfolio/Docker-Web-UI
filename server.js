const http = require('http');
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const port = 3000;

const getContentType = (url) => {
	switch (path.extname(url)){
		case ".html":
			return "text/html";
		case ".css":
			return "text/css";
		case ".js":
			return "text/javascript";
	}
}

/*const sendResponse = (url, contentType, res) => {
	let file = path.
}*/

const server = http.createServer((req,res)=>{
	console.log("request made, attempting to fetch: " + req.url);
	let file = path.join(process.cwd(), "./static");
	file = path.join(file,req.url);
	//console.log("server attempting to open: " + file);
	const contentType = getContentType(req.url);
	fs.readFile(file,(err,content) => {
		if (err){
			res.writeHead(404);
			res.write(`File '${file}'not Found`);
			res.end();
			console.log("response 404, file not found");
		}
		else{
			res.writeHead(200, { "Content-Type": contentType});
			res.write(content);
			res.end();
			console.log("response: 200, file found");
		}
	});

});

const io = new Server(server);
io.on('connection', (socket) =>{
	console.log("a user connected");
	exec(" sudo docker ps", (error, stdout, stderr)=>{
		if (error){
			console.log("error: " + error.message);
		}
		if(stderr){
			console.log("stderr: " + stderr);
		}
		console.log(stdout);
	});

});

server.listen(port,'localhost',()=>{
	console.log('listening for requests on port: ' + port);

});


