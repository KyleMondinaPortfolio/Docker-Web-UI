const express = require("express");
const socket = require("socket.io");
const  Docker  = require("dockerode");
const stream = require("stream");

const docker = new Docker({socketPath:'/var/run/docker.sock'});

//Set up the http server
const PORT = 5000;
const HOST = '0.0.0.0';
const app = express();

const containerLogs = (container,res)=>{
	//let logStream = new stream.PassThrough();
//	logStream.on('data', (chunk)=>{
		//console.log(chunk.toString('utf8'));
		//logStream.pipe(res);
		//res.send(chunk.toString('utf8'));
	//})
	let chunks = "";
	container.logs({
		follow:true,
		stdout:true,
		stderr:true
	},(err,stream)=>{
		if (err) {console.log(err)}
		//container.modem.demuxStream(stream,logStream,logStream);
		stream.on('data',(chunk)=>{
			//stream.pipe(res);
			/*console.log("-----new chunk----")
			console.log(chunk.toString('utf8'))
			console.log("-----end of new chunk----")
			res.write("-----new chunk----\n")
			res.write(chunk.toString('utf8')+'\n','utf8');
			res.write("-----end of new chunk----\n")
			*/
			console.log(chunk.toString('utf8'))
			chunks = chunks.concat(chunk.toString('utf8'));
			//chunks.push(chunk.toString('utf8'));
		})
		stream.on('end', ()=>{
			//logStream.end('!stop!');
			res.writeHead(200,{
				'Content-Length':Buffer.byteLength(chunks),
			});
			res.write(chunks);
			res.end('!stop!');
		})
		/*setTimeout(()=>{
			//stream.destroy();
		},2000)*/
	})
}

app.get("/containers", (req,res)=>{
	docker.listContainers({all:"true"},(err,containers)=>{
		if (err){
			console.log(err);
		}else{
			res.json(containers);
		}
	});
})

app.get("/containers/:id",(req,res)=>{
	res.setHeader('Content-Type', 'text/html');
	//res.setHeader('Transfer-Encoding', 'chunked');
	let rqstedContainer = docker.getContainer(req.params.id)
	containerLogs(rqstedContainer,res);
})

const server = app.listen(PORT,HOST, ()=>{
	console.log(`${HOST} server Running: listening on port ${PORT}`);
});





