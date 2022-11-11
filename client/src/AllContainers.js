import React, {useState, useEffect} from 'react'
import axios from 'axios'
import ContainerLabels from './ContainerLabels.js'
import TableRow from './TableRow.js'

const REFRESH_TIME = 2000;

const Loading = () => {
	return(<p> Loading ... </p>)
}

const AllContainers = () => {
	const [containers,updateContainers] = useState([])
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
		<div id="Containers">
	
		{(containers.length===0)
			?<Loading/>
			:<table><tbody>
				<ContainerLabels/>
				{containers.map((container)=>{
					return(<TableRow key = {container.cid} container={container}/>)
				})}
			</tbody></table>

		}
		</div>
	)

}


export default AllContainers
