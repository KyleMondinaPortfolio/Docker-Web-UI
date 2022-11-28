import React, {useState, useEffect} from 'react'
import axios from 'axios'
import ContainerLabels from './ContainerLabels.js'
import TableRow from './TableRow.js'
import './AllContainers.css'

const REFRESH_TIME = 2000;

const Loading = () => {
	return(<p> Loading ... </p>)
}



const AllContainers = () => {
	const [containers,updateContainers] = useState([])
	const [selectedContainer, selectContainer] = useState("");
	const handler = (cid) =>{
		console.log("i have been called");
		selectContainer(cid);
	}
	
	useEffect(()=>{
		console.log(selectedContainer);
	},[selectedContainer])

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

	return (
		<div class="all-containers">
		<div class = "all-containers-header">
		 	<h3>Container List</h3>
		</div>
	
		<div class = "all-containers-table">
		{(containers.length===0)
			?<Loading/>
			:<table><tbody>
				<ContainerLabels/>
				{containers.map((container)=>{
					return(<TableRow handler = {handler} key = {container.cid} container={container}/>)
				})}
			</tbody></table>

		}
		</div>
		</div>
	)

}


export default AllContainers
