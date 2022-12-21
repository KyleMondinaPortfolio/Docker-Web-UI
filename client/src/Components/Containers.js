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
	const [selected_container_state, set_selected_container_state] = useState("")

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
      <h2>Container List</h2>
      {(containers_loaded === false)
        ?<h3>Loading Containers...</h3>
        :<ContainersLoaded
          containers = {containers}
          selected_container = {selected_container}
          select_container = {select_container} 
          selected_container_state = {selected_container_state}
          set_selected_container_state = {set_selected_container_state}
        />
      }
    </div>
  )
}

//----------Child Components ------------------

const ContainersLoaded = ({containers,selected_container,select_container,selected_container_state, set_selected_container_state}) =>{

  const start_button = (selected_container, selected_container_state)=>{
      let disabled = true;
      console.log(`selected_container_state: ${selected_container_state}`)
      if (selected_container === "" || selected_container_state === ""){
        disabled = true;
      } 
      else if (selected_container_state === "exited"){
        disabled = false;
      }
      if (!disabled){
        console.log("start button enabled")
        set_selected_container_state("running")
        socket.emit("start_container", selected_container)
      }else{
        console.log("start button disabled")
      }
  }

  const stop_button = (selected_container, selected_container_state)=>{
      let disabled = true;
      console.log(`selected_container_state: ${selected_container_state}`)
      if (selected_container === "" || selected_container_state === ""){
        disabled = true;
      } 
      else if (selected_container_state === "running"){
        disabled = false;
      }
      if (!disabled){
        console.log("stop button enabled")
        set_selected_container_state("exited")
        socket.emit("stop_container", selected_container)
      }else{
        console.log("stop button disabled")
      }
  }

  const delete_button = (selected_container, selected_container_state)=>{
      let disabled = true;
      console.log(`selected_container_state: ${selected_container_state}`)
      if (selected_container === "" || selected_container_state === ""){
        disabled = true;
      } 
      else if (selected_container_state === "exited"){
        disabled = false;
      }
      if (!disabled){
        console.log("delete button enabled")
        set_selected_container_state("")
        socket.emit("delete_container", selected_container)
      }else{
        console.log("delete button disabled")
      }
      select_container("");
  }

  return(
    <div class = "containers_table">
      <div class = "container_controls">
			  <button id="start_button" onClick = {()=>{start_button(selected_container,selected_container_state)}}> Start </button>
			  <button id="stop_button" onClick = {()=>{stop_button(selected_container,selected_container_state)}}> Stop </button>
			  <button id="delete_button" onClick = {()=>{delete_button(selected_container,selected_container_state)}}> Delete </button>
      </div>
      <table>
        <thead>
          <TableHeader/>
        </thead>
        <tbody>
          {containers.filter((container)=>container.cimage!=="advantest-kylemondina/node-docker-ui").map((container)=>{
            return(<TableRow 
              select_container={select_container} 
              selected_container_state={selected_container_state} 
              set_selected_container_state = {set_selected_container_state}
              key = {container.cid} 
              container = {container}
            />)
          })}
        </tbody>
      </table>
    </div>
  )
}

const TableHeader = ()=>{
	return(
	   <tr>
			<th></th>
			<th>Name</th>
			<th>State</th>
			<th>Image</th>
			<th>Status</th>
	   </tr>
	)
}

			//<td><button onClick = {()=>{select_container(cid)}}></button></td>
const TableRow = (props) => {
	const cid = props.container.cid	
	const cname = props.container.cname 	
	const cimage = props.container.cimage	
	const cstate = props.container.cstate 
	const cstatus = props.container.cstatus
  const select_container = props.select_container
  const selected_container_state = props.selected_container_state
  const set_selected_container_state = props.set_selected_container_state
	return(
		<tr>
      <td><input type="radio" id = {cid} name="optradio" onClick ={()=>{select_container(cid); set_selected_container_state(cstate)}}></input></td>
			<td class = "container-name">
				<Link style={{textDecoration:'none', color: 'black'}} to ={`/container/${cid}/${cstate}/${cname}`}>{cname}</Link>	
			</td>
			<td>{cstate}</td>
			<td>{cimage}</td>
			<td>{cstatus}</td>
		</tr>
	)
}

export default Containers
