import React from 'react'
import {Link,Outlet} from "react-router-dom"
import {useParams} from 'react-router-dom';

import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'
import './Container.css'

const Container = (props) => {
	const {cid} = useParams();
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
