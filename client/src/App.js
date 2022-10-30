
import React, {useState, useEffect} from 'react'
import axios from 'axios'

const extractInfo = (container) => {
	return {
		cid:container.Id,
		cname:container.Names[0],
		cimage:container.Image,
		cstate:container.State,
		cstatus:container.Status,
	}
}

const App = () => {

	const [containers,updateContainers] = useState([])
	
	setInterval(()=>{
		
		axios("/containers")
			.then(response => {
				updateContainers(response.data.map(extractInfo));
			})
			.catch(error => console.log(error))
	},10000);
	useEffect(()=>{
		console.log(containers)
	},[containers])
	
	return (
		<p> Hello World </p>
	)

}

export default App
