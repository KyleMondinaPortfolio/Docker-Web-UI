import React from 'react'
import {Link,Outlet} from "react-router-dom"
import {useParams} from 'react-router-dom';

import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'
import './Container2.css'

const Container = (props) => {
	const {cid} = useParams();
	return(
		<div class = "container-wrapper">
			<div class = "container-header">
			   <Link to ={"/"}>Back</Link>	
			   <h3>Container {cid}</h3>
			</div>
			<div class = "container-content">
			   <div class = "container-tab">
			      <div class = "link-1">
				<p><Link className = "link" to ={`containerLogs/${cid}`}>Logs</Link></p>
			      </div>
			      <div class = "link-2">
				<p><Link className = "link" to ={`containerStats/${cid}`}>Stats</Link></p>
			      </div>
			   </div>
			   <div class = "container-router">
			      <Outlet/>
			   </div>
			</div>
		</div>
	)
}

export default Container
