import React, {useState, useEffect} from 'react'
import axios from 'axios'
import ContainerLabels from './ContainerLabels.js'
import Container from './Container.js'

const trimContainerData = (container) => {
	return {
		cid:container.Id,
		cname:container.Names[0].slice(1),
		cimage:container.Image,
		cstate:container.State,
		cstatus:container.Status,
	}
}

const Loading = () => {
	return(<p> Loading ... </p>)
}

const DisplayContainers = () => {
	const [containers,updateContainers] = useState([])
	setInterval(()=>{
		axios("/containers")
			.then(response => {
				updateContainers(response.data.map(trimContainerData));
			})
			.catch(error => console.log(error))

	},10000)

	return (
		<div className="Containers">
		{(containers.length===0)
			?<Loading/>
			:<table><tbody>
				<ContainerLabels/>
				{containers.map((container)=>{
					return(<Container key = {container.cid} container={container}/>)
				})}
			</tbody></table>

		}
		</div>
	)

}


export default DisplayContainers
