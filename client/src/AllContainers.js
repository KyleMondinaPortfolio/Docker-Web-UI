import React, {useState, useEffect} from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import ContainerLabels from './ContainerLabels.js'
import TableRow from './TableRow.js'
import './AllContainers.css'

const socket = io();
const REFRESH_TIME = 2000;

const Loading = () => {
	return(<p> Loading ... </p>)
}

const ContainersPresent = ({containers,change_state, cid,  start_container, stop_container, delete_container}) =>{
	return (<div class = "containers-present">
		<div class = "containers-controls">
			<button onClick = {()=>{start_container(cid)}}> Start </button>
			<button onClick = {()=>{stop_container(cid)}}> Stop </button>
			<button onClick = {()=>{delete_container(cid)}}> Delete </button>
		</div>
		<table><tbody>
			<ContainerLabels/>
			{containers.map((container)=>{
				return(<TableRow change_state = {change_state} key = {container.cid} container={container}/>)
			})}
		</tbody></table>
	</div>)
}

const AllContainers = () => {
	const [containers,updateContainers] = useState([])
	const [selected_container, selectContainer] = useState("");
	const change_state = (cid) =>{
		console.log("i have been called");
		selectContainer(cid);
	}
	const start_container = (cid)=>{
		console.log("start_container")
		socket.emit("start_container",cid)
	}
	const stop_container = (cid)=>{
		console.log("stop_container")
		socket.emit("stop_container",cid)
	}
	const delete_container = (cid)=>{
		console.log("delete_container")
		socket.emit("delete_container",cid)
	}
	
	useEffect(()=>{
		console.log(selected_container);
	},[selected_container])

	useEffect(()=>{
		let controller = new AbortController();
		let timerId = setInterval(()=>{
			axios.get("/containers",{signal:controller.signal})
				.then(response => {
					updateContainers(response.data);
				})
				.catch(error => console.log(error))

		},REFRESH_TIME)
		return () => {
			clearTimeout(timerId);
			controller.abort();
		}
	},[])

	return (<div class="all-containers">
		<div class = "all-containers-header">
		 	<h3>Container List</h3>
		</div>
		<div class = "all-containers-table">
		{(containers.length===0)
			?<Loading/>
			:<ContainersPresent 
				containers = {containers} 
				change_state={change_state} 
				cid = {selected_container}
				start_container = {start_container}
				stop_container = {stop_container}
				delete_container = {delete_container}
			 />
		}
		</div>
	</div>)
}

export default AllContainers
