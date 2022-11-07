import React from 'react'
import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import {Link,Outlet} from "react-router-dom"
import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'
import './Container.css'
import {useParams} from 'react-router-dom';




const Container = (props) => {
	const {cid} = useParams();
	//const cid = props.container.cid	
	//const cname = props.container.cname 	
	//const cimage = props.container.cimage	
	//const cstate = props.container.cstate 
	//const cstatus = props.container.cstatus

	//<Link to ={`containerLogs/${cid}`}>{cid}</Link>	
	return(
		<div id = "Container">
			<h3>Container {cid}</h3>
			<Link to ={"/"}>Back to Containers</Link>	
			<ul>
				<li><p ><Link className = "link" to ={`containerLogs/${cid}`}>Logs</Link></p></li>	
				<li><p ><Link className = "link" to ={`containerStats/${cid}`}>Stats</Link></p></li>	
			</ul>
			<Outlet/>
		</div>
	)
}

export default Container
