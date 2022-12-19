import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import io from 'socket.io-client'
import './Containers.css'

const socket = io();
const refresh_time = 2000;

//----------Main Component ------------------

const Containers = ()=>{

  const [containers,fetch_containers] = useState([])
	const [containers_loaded,load_containers] = useState(false)
	const [selected_container, select_container] = useState("")

  useEffect(()=>{
    //fetch containers from the server, controller is present to prevent page from fetching data when not opened
    let controller = new AbortController();
		let timerId = setInterval(()=>{
      axios.get("/containers",{signal:controller.signal})
				.then(response => {
                    fetch_containers(response.data)
                    load_containers(true)
				})
				.catch(error => console.log(error))
		},refresh_time)
		return () => {
			clearTimeout(timerId);
			controller.abort();
		}
  },[])

  return(
    <div class = "containers">
      <h3>Containers</h3>
      {(containers_loaded === false)
        ?<p>Loading Containers ...</p>
        :<ContainersLoaded
          containers = {containers}
          selected_container = {selected_container}
          select_container = {select_container} 
        />
      }
    </div>
  )
}

//----------Child Components ------------------

const ContainersLoaded = ({containers,selected_container,select_container}) =>{
  return(
    <div class = "containers_table">
      <div class = "container_controls">
			  <button onClick = {()=>{socket.emit("start_container", selected_container)}}> Start </button>
			  <button onClick = {()=>{socket.emit("stop_container", selected_container)}}> Stop </button>
			  <button onClick = {()=>{socket.emit("delete_container", selected_container)}}> Delete </button>
      </div>
      <table>
        <thead>
          <TableHeader/>
        </thead>
        <tbody>
          {containers.map((container)=>{
            return(<TableRow select_container={select_container} key = {container.cid} container = {container}/>)
          })}
        </tbody>
      </table>
    </div>
  )
}

const TableHeader = ()=>{
	return(
	   <tr>
			<th>Select</th>
			<th>ID</th>
			<th>Name</th>
			<th>Image</th>
			<th>State</th>
			<th>Status</th>
	   </tr>
	)
}

const TableRow = (props) => {
	const cid = props.container.cid	
	const cname = props.container.cname 	
	const cimage = props.container.cimage	
	const cstate = props.container.cstate 
	const cstatus = props.container.cstatus
  const select_container = props.select_container
	return(
		<tr>
			<td><button onClick = {()=>{select_container(cid)}}></button></td>
			<td>
				<Link style={{textDecoration:'none'}} to ={`/container/${cid}/${cstate}`}>{cid}</Link>	
			</td>
			<td>{cname}</td>
			<td>{cimage}</td>
			<td>{cstate}</td>
			<td>{cstatus}</td>
		</tr>
	)
}

export default Containers
