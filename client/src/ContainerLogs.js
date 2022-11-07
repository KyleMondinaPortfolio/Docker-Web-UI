import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"
import {useParams} from 'react-router-dom';
import './ContainerLogs.css'


const ContainerLogs = ()=>{
	
	const {cid} = useParams();
	const [containerLogs,setContainerLogs]=useState([]);
	
	useEffect(()=>{
		axios(`/container_logs/${cid}`)
			.then(response=>{
				setContainerLogs(response.data.split('\n'));
				
			})
			.catch(error=>console.log(error))
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
