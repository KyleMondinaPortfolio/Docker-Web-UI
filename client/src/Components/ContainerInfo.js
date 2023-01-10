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
        <table>
          <tr>
            <td><p>Name</p></td>
            <td><p>{container_info.name}</p></td>
          </tr>
          <tr>
            <td><p>Image Name</p></td>
            <td><p>{container_info.image_name}</p></td>
          </tr>
          <tr>
            <td><p>Image ID</p></td>
            <td><p>{container_info.image}</p></td>
          </tr>
          <tr>
            <td><p>Status</p></td>
            <td><p>{container_info.cstatus}</p></td>
          </tr>
          <tr>
            <td><p>Running</p></td>
            <td><p>{container_info.running.toString()}</p></td>
          </tr>
          <tr>
            <td><p>Started At:</p></td>
            <td><p>{container_info.started}</p></td>
          </tr>
          <tr>
            <td><p>PID</p></td>
            <td><p>{container_info.pid}</p></td>
          </tr>
          <tr>
            <td><p>Path</p></td>
            <td><p>{container_info.path}</p></td>
          </tr>
         </table>
			</div>
		}
		</div>
	)
}

export default ContainerInfo
