import React from 'react'
import {Link,Outlet} from "react-router-dom"
import {useParams} from 'react-router-dom';

import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'
import Container2Stats from './Container2Stats.js'
import './Container.css'

const Container = (props) => {
	const {cid} = useParams();
	const {cstate} = useParams();
	return(
		<div class = "container-wrapper">
			<div class = "container-header">
			   <p><Link style = {{textDecoration:'none', color:'black'}} to ={"/"}>Back</Link></p>	
			   <h3>Container {cid}</h3>
			</div>
			<div class = "container-content">
			   <div class = "container-tab">
			      <div class = "link-1">
				<p><Link style = {{textDecoration:'none', color:'white'}} to ={`containerLogs/${cstate}/${cid}`}>Logs</Link></p>
			      </div>
			      <div class = "link-2">
				<p><Link style = {{textDecoration:'none', color:'white'}} to ={`containerStats/${cstate}/${cid}`}>Stats</Link></p>
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
