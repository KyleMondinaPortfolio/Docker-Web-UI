const socket = io();
const docker_information = document.getElementById('docker-information');

setInterval(()=>{
	socket.emit("request-containers");
},1000);



socket.on("containers-sent", (containers)=>{
	if (containers.length>=1){
		//there are containers running
		const containers_table = createContainersTable();
		createTableRows(containers_table,containers);
		const existing_table = document.getElementById("containers_table");
		if (existing_table){
			docker_information.replaceChild(containers_table,existing_table);
		}else{
			const no_containers = document.getElementById("no_containers");
			if(no_containers){
				docker_information.replaceChild(containers_table,no_containers);
			}else{
				docker_information.appendChild(containers_table);
			}
		}
		console.log(containers);

	}else{
		//there are no containers running
		const existing_no_containers = document.getElementById("no_containers");
		const containers_table = document.getElementById("containers_table");
		const no_containers = document.createElement("h3");
		no_containers.innerHTML = "There are no containers running";
		no_containers.setAttribute("id", "no_containers");
		if (existing_no_containers){
			docker_information.replaceChild(no_containers,existing_no_containers);
		}else{
			docker_information.appendChild(no_containers);
		}
		if(containers_table){
			docker_information.replaceChild(no_containers,containers_table);
		}

	}
})






