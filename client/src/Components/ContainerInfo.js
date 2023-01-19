import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"
import {useParams} from 'react-router-dom';
import './ContainerInfo.css'


const ContainerInfo = ()=>{
	
	const {cid} = useParams();
	const [container_info,set_container_info]=useState({});
	
	useEffect(()=>{
		
		//abort controller to clean up fetch request
		let controller = new AbortController();
		axios.get(`/container_info/${cid}`,{signal:controller.signal})
			.then(response=>{
        set_container_info({
          name:response.data.Name.slice(1),
          id:response.data.Id,
          image_name:response.data.Config.Image,
          image:response.data.Image,
          cstatus:response.data.State.Status,
          running:response.data.State.Running,
          started: new Date(response.data.State.StartedAt).toLocaleString("en-US"),
          pid:response.data.State.Pid,
          path:response.data.Path,
          log_path:response.data.LogPath,
          host_name_path:response.data.HostnamePath,
          hosts_path:response.data.HostsPath,
        });
			})
			.catch(error=>console.log(error))

		//clean up function to abort axios fetch when component is unmounted
		return () => {controller.abort();}
	},[])

  useEffect(()=>{
    console.log(container_info)
  },[container_info])

	return(
		<div className ="container-info-wrapper">
		{(Object.keys(container_info).length===0)
			?<h4>Fetching Container Info...</h4>
			:<div className="container-info">
        <div className = "container-info-item">
          <p className="container-info-header">Name</p>
          <p className="container-info-value">{container_info.name}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">ID</p>
          <p className="container-info-value">{container_info.id}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Image Name</p>
          <p className="container-info-value">{container_info.image_name}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Image ID</p>
          <p className="container-info-value">{container_info.image}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Status</p>
          <p className="container-info-value">{container_info.cstatus}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Running</p>
          <p className="container-info-value">{container_info.running.toString()}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Started At:</p>
          <p className="container-info-value">{container_info.started}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">PID</p>
          <p className="container-info-value">{container_info.pid}</p>
        </div>
        <div className = "container-info-item">
          <p className="container-info-header">Path</p>
          <p className="container-info-value">{container_info.path}</p>
        </div>
			</div>
		}
		</div>
	)
}

export default ContainerInfo
