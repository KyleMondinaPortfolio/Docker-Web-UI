const express = require("express");
const socket = require("socket.io");
const  Docker  = require("dockerode");
const cors = require("cors");
const docker = new Docker({socketPath:'/var/run/docker.sock'});
const utils = require("./containerDataUtils.js") 
const stream = require('stream');

//Set up the http server
const PORT = 5000;
const HOST = '0.0.0.0';
const app = express();

const request_log = (cid)=>{
  const container = docker.getContainer(cid);
  const logStream = new stream.PassThrough();
  logStream.on('data',(chunk)=>{
    console.log(chunk.toString('utf8'));
    io.emit("container_log_sent", chunk.toString('utf8'));
  });
  container.logs({
    follow:true,
    stdout:true,
    stderr:true,
  }, (err,stream)=>{
    if(err){
      return logger.error(err.message);
    }
    container.modem.demuxStream(stream,logStream,logStream);
    stream.on('end', ()=>{
      logStream.end('!stop!');
    });
    setTimeout(()=>{
      stream.destroy();
    },2000);
  });
}

const request_log2 = (cid) =>{
  const container = docker.getContainer(cid);
  container.logs({
    follow:true,
    stdout:true,
    stderr:true
  }).then((stream)=>{
    stream.on('data',(chunk)=>{
      io.emit("container_log_sent",chunk.toString('utf8'))
    })
    stream.on('error',(error)=>{console.log(error)})
  })
}


const containerLogs = (container,res)=>{
	let chunks = "";

	let logStream = new stream.PassThrough();
	logStream.on('data', (chunk)=>{
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

app.use(express.static("build"));
app.use(cors());

app.get("/containers", (req,res)=>{
	docker.listContainers({all:"true"},(err,containers)=>{
		if (err){
			console.log(err);
		}else{
			res.json(containers.map(utils.trimContainer));
		}
	});
})

app.get("/container_info/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	rqstedContainer.inspect((err,data)=>{
    if(err){console.log(err)}
    else{
      res.json(data)
    }
  })   
})

app.get("/container_logs/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	//we need to add an error here
	containerLogs(rqstedContainer,res);
})

app.get("/container_stats_raw/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	rqstedContainer.stats({stream:false},(err,stats)=>{
		if(err){console.log(err)}
		else{
			res.json(stats);
		}
	});
})

app.get("/container_stats/:cid",(req,res)=>{
	res.setHeader('Content-Type', 'application/json');
	let rqstedContainer = docker.getContainer(req.params.cid)
	rqstedContainer.stats({stream:false},(err,stats)=>{
		if(err){console.log(err)}
		else{
			res.json(utils.trimContainerStats(stats));
		}
	});
})

const server = app.listen(PORT,HOST, ()=>{
	console.log(`${HOST} server Running: listening on port ${PORT}`);
});

const io = socket(server, {
	cors:{
		origin:"http://localhost:5000",
		methods:["GET","POST"],
		transports:['websocket','polling'],
		credentials:true
	},
	allowEIO3:true
});

const start_container = (cid) => {
	console.log(`${cid} requested to start`);
	const container = docker.getContainer(cid);
	container.start((err,data)=>{console.log(data)})
}
const stop_container = (cid) => {
	console.log(`${cid} requested to stop`);
	const container = docker.getContainer(cid);
	container.stop((err,data)=>{console.log(data)})
}
const delete_container = (cid) => {
	console.log(`${cid} requested to be deleted`);
	const container = docker.getContainer(cid);
	container.remove((err,data)=>{console.log(data)})
}

io.on("connection", (socket)=>{
	socket.on("start_container", (cid)=>{start_container(cid)});
	socket.on("stop_container", (cid)=>{stop_container(cid)});
	socket.on("delete_container", (cid)=>{delete_container(cid)});
  socket.on("request_container_log", (cid)=>{request_log(cid)});
});
