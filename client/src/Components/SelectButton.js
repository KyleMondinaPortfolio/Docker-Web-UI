import React, {useState,useEffect} from 'react'


const SelectButton = (props)=>{

  const cid = props.cid
  
  const selected_containers = props.selected_containers
  const add_selected_container = props.add_selected_container
  const remove_selected_container = props.remove_selected_container

  const container_state = props.container_state
  const containers_state = props.containers_state
  const set_containers_state = props.set_containers_state

  const [disabled, set_disabled] = useState(!(containers_state === "unset"))
  const [checked, set_checked] = useState(false)

  useEffect(()=>{
    set_disabled(!(containers_state==="unset"||container_state === containers_state))
  },[containers_state])

  const button_clicked = () =>{
    if(!disabled){
      if(!checked){
        if(selected_containers.length === 0){
          set_containers_state(container_state)
        }
        add_selected_container(cid)
      }else if(checked){
        if(selected_containers.length === 1){
          set_containers_state("unset")
        }
        remove_selected_container(cid)
      }
    }
  }

	return(
		<div className ="select-button">
      <input type="checkbox" disabled={disabled} checked={checked} onClick = {()=>{button_clicked()}} />
		</div>
	)
}

export default SelectButton
