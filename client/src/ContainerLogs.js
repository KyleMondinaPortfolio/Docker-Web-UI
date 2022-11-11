import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"
import {useParams} from 'react-router-dom';
import './ContainerLogs.css'


const ContainerLogs = ()=>{
	
	const {cid} = useParams();
	const [containerLogs,setContainerLogs]=useState([]);
	
	useEffect(()=>{
		
		//abort controller to clean up fetch request
		let controller = new AbortController();
		axios.get(`/container_logs/${cid}`,{signal:controller.signal})
			.then(response=>{
				setContainerLogs(response.data.split('\n'));
				
			})
			.catch(error=>console.log(error))

		//clean up function to abort axios fetch when component is unmounted
		return () => {controller.abort();}
	},[])


	return(
		<div className ="container-logs-wrapper">
		{(containerLogs.length===0)
			?<p>loading...</p>
			:<div className="container-logs">
				{containerLogs.map((line,index)=>{
					return(<p key = {index}>{line}</p>)
				})}
			</div>
			

		}
		</div>
	)
}

export default ContainerLogs
