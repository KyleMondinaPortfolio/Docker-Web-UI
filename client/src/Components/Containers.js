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

  //new container controlls
  const [selected_containers,update_selected_containers] = useState([])
  const [containers_state,update_containers_state] = useState("unset")
  
  useEffect(()=>{
    console.log(selected_containers)
  },[selected_containers])
  useEffect(()=>{
    console.log(containers_state)
  },[containers_state])

  const clear_containers = ()=>{
    update_selected_containers([])
  }
  const add_selected_container = (cid) =>{
    update_selected_containers(containers=>[...containers,cid])
  }
  const remove_selected_container = (cid) =>{
    update_selected_containers(containers=>containers.filter(container=>container!==cid))
  }
  const set_containers_type = (container_state)=>{
    update_containers_state(container_state)
  }

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

          selected_containers  = {selected_containers}
          clear_containers = {clear_containers}
          add_selected_container = {add_selected_container}
          remove_selected_container = {remove_selected_container} 
          containers_state = {containers_state}
          set_containers_type = {set_containers_type}

        />
      }
    </div>
  )
}

//----------Child Components ------------------

const ContainersLoaded = ({
                            containers,
                            selected_container,
                            select_container,
                            selected_container_state, 
                            set_selected_container_state,

                            selected_containers, 
                            clear_containers,
                            add_selected_container, 
                            remove_selected_container, 
                            containers_state, 
                            set_containers_type 
                          }) =>{

  const [checkboxes,clear_checkboxes] = useState(0)
  const [start_btn_disabled, change_start_state] = useState(true)
  const [stop_btn_disabled, change_stop_state] = useState(true)
  const [delete_btn_disabled, change_delete_state] = useState(true)

  useEffect(()=>{
      if (containers_state === "unset"){
        change_start_state(true)
        change_stop_state(true)
        change_delete_state(true)
      } 
      else if (containers_state === "exited" || containers_state === "created"){
        change_start_state(false)
        change_delete_state(false)
      }
      else if (containers_state === "running"){
        change_stop_state(false)
      }
  },[containers_state])

  const start_button = (selected_container, selected_container_state)=>{
      //let disabled = true;
      //console.log(`selected_container_state: ${selected_container_state}`)
      //if (containers_state === "unset"){
        //change_start_state(true)
        //disabled = true;
      //} 
      //else if (containers_state === "exited"){
        //disabled = false;
        //change_start_state(false)
      //}
      if (!start_btn_disabled){
        console.log("start button enabled")
        set_selected_container_state("running")
        selected_containers.forEach((container)=>{
          let cid = container
          socket.emit("start_container", cid)
        })
        clear_containers()
        set_containers_type("unset")
        clear_checkboxes(checkboxes+1)
        
      }else{
        console.log("start button disabled")
      }
  }

  const stop_button = (selected_container, selected_container_state)=>{
      //let disabled = true;
      //console.log(`selected_container_state: ${selected_container_state}`)
      //if (containers_state === "unset"){
        //change_stop_state(true)
        //disabled = true;
      //} 
      //else if (containers_state === "running"){
        //change_stop_state(false)
        //disabled = false;
      //}
      if (!stop_btn_disabled){
        console.log("stop button enabled")
        set_selected_container_state("exited")
        selected_containers.forEach((container)=>{
          let cid = container
          socket.emit("stop_container", cid)
        })
        clear_containers()
        set_containers_type("unset")
        clear_checkboxes(checkboxes+1)
      }else{
        console.log("stop button disabled")
      }
  }

  const delete_button = (selected_container, selected_container_state)=>{
      //let disabled = true;
      //console.log(`selected_container_state: ${selected_container_state}`)
      //if (containers_state === "unset"){
        //change_delete_state(true)
        //disabled = true;
      //} 
      //else if (containers_state === "exited"){
        //change_delete_state(false)
        //disabled = false;
      //}
      if (!delete_btn_disabled){
        console.log("delete button enabled")
        set_selected_container_state("")
        selected_containers.forEach((container)=>{
          let cid = container
          socket.emit("delete_container", cid)
        })
        clear_containers()
        set_containers_type("unset")
        clear_checkboxes(checkboxes+1)
      }else{
        console.log("delete button disabled")
      }
      select_container("");
  }

  return(
    <div class = "containers_table">
      <div class = "container_controls">
			  <button id={start_btn_disabled ? "start_button_disabled":"start_button_enabled"} onClick = {()=>{start_button(selected_container,selected_container_state)}}> Start </button>
			  <button id={stop_btn_disabled ? "stop_button_disabled":"stop_button_enabled"} onClick = {()=>{stop_button(selected_container,selected_container_state)}}> Stop </button>
			  <button id={delete_btn_disabled ? "delete_button_disabled":"delete_button_enabled"} onClick = {()=>{delete_button(selected_container,selected_container_state)}}> Delete </button>
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

              checkboxes = {checkboxes}
              selected_containers  = {selected_containers}
              add_selected_container = {add_selected_container}
              remove_selected_container = {remove_selected_container} 
              containers_state = {containers_state}
              set_containers_type = {set_containers_type}
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

  const checkboxes = props.checkboxes
  const selected_containers = props.selected_containers 
  const add_selected_container = props.add_selected_container
  const remove_selected_container = props.remove_selected_container
  const containers_state = props.containers_state
  const set_containers_type = props.set_containers_type

	return(
		<tr>
      <td>
        <SelectButton
          cid = {cid}
          checkboxes = {checkboxes}
          selected_containers = {selected_containers}
          add_selected_container = {add_selected_container}
          remove_selected_container = {remove_selected_container}
          container_state = {cstate}
          containers_state = {containers_state}
          set_containers_type = {set_containers_type}
        />
      </td>
			<td class = "container-name">
				<Link style={{textDecoration:'none', color: 'black'}} to ={`/container/${cid}/${cstate}/${cname}`}>{cname}</Link>	
			</td>
			<td>{cstate}</td>
			<td>{cimage}</td>
			<td>{cstatus}</td>
		</tr>
	)
}

const SelectButton = (props)=>{

  const cid = props.cid

  const checkboxes = props.checkboxes
  const selected_containers = props.selected_containers
  const add_selected_container = props.add_selected_container
  const remove_selected_container = props.remove_selected_container

  const container_state = props.container_state
  const containers_state = props.containers_state
  const set_containers_state = props.set_containers_type

  const [disabled, set_disabled] = useState(!(containers_state === "unset"))
  const [checked, set_checked] = useState(false)

  useEffect(()=>{
    set_disabled(!(containers_state==="unset"||container_state === containers_state))
  },[containers_state])

  useEffect(()=>{
    set_checked(false)
  },[checkboxes])

  const button_clicked = () =>{
    if(!disabled){
      if(!checked){
        if(selected_containers.length === 0){
          console.log("array was intially zero so we should change")
          set_containers_state(container_state)
        }
        add_selected_container(cid)
        set_checked(true)
      }else if(checked){
        if(selected_containers.length === 1){
          set_containers_state("unset")
        }
        remove_selected_container(cid)
        set_checked(false)
      }
    }
  }

	return(
		<div className ="select-button">
      <input type="checkbox" disabled={disabled} checked={checked} onClick = {()=>{button_clicked()}} />
		</div>
	)
}


export default Containers
