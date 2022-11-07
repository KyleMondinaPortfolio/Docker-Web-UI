const express = require("express");
const socket = require("socket.io");
const  Docker  = require("dockerode");
const stream = require("stream");
const cors = require("cors");

const docker = new Docker({socketPath:'/var/run/docker.sock'});

//Set up the http server
const PORT = 5000;
const HOST = '0.0.0.0';
const app = express();

const containerLogs = (container,res)=>{
	let chunks = "";

	let logStream = new stream.PassThrough();
	logStream.on('data', (chunk)=>{
		console.log(chunk.toString('utf8'));
		chunks = chunks.concat(chunk.toString('utf8'));
	})
	container.logs({
		follow:true,
		stdout:true,
		stderr:true
	},(err,stream)=>{
		if (err) {console.log(err)}
		container.modem.demuxStream(stream,logStream,logStream);
		stream.on('end', ()=>{
			logStream.end('-----END OF LOGS-----');
			res.writeHead(200,{
				'Content-Length':Buffer.byteLength(chunks),
			});
			res.write(chunks);
			res.end('-----END OF LOGS-----');

		})
	})
}


app.use(express.static("buildv4"));
app.use(cors());

app.get("/containers", (req,res)=>{
	docker.listContainers({all:"true"},(err,containers)=>{
		if (err){
			console.log(err);
		}else{
			res.json(containers);
		}
	});
})

app.get("/container_logs/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	//we need to add an error here
	containerLogs(rqstedContainer,res);
})

app.get("/container_stats/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	rqstedContainer.stats({stream:false},(err,stats)=>{
		if(err){console.log(err)}
		else{
			res.json(stats);
		}
	});
})

const server = app.listen(PORT,HOST, ()=>{
	console.log(`${HOST} server Running: listening on port ${PORT}`);
});





