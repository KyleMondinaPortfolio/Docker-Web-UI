import React, {useState,useEffect} from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import {Link} from 'react-router-dom'
import {useParams} from 'react-router-dom'
import './ContainerLogs.css'
const socket = io();


const ContainerLogs = ()=>{
	
	const {cid} = useParams();
	const {cstate} = useParams();
  const [old_log, update_log] = useState("");
  const [logs, updateLogs] = useState([""]);

  useEffect(()=>{
    socket.emit("request_container_log", cid);
  },[])

  socket.off("container_log_sent").on("container_log_sent",(chunks)=>{
      console.log(chunks)
      updateLogs(logs=>{
          return [...logs,chunks]
      });
  })

	return(
		<div className ="container-logs-wrapper">
		  <div className="container-logs">
        {logs.map((line,index)=>{
					return(<p key = {index}>{line}</p>)
		    })}
		  </div>
		</div>
	)
}

export default ContainerLogs
