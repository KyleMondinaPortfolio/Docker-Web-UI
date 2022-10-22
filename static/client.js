const socket = io();
const button = document.getElementById('display-containers');
const docker_information = document.getElementById('docker-information');

//temporary
button.addEventListener("click", (e)=>{
	e.preventDefault();
	socket.emit("request-containers");
});

const createContainersTable = () =>{
	const table = document.createElement("table");
	table.setAttribute("id","containers_table");
	const container_id = document.createElement("th");
	const container_name = document.createElement("th");
	const container_image = document.createElement("th");
	const container_status = document.createElement("th");
	const container_state= document.createElement("th");
	container_id.innerHTML = "ID";
	container_name.innerHTML = "NAME";
	container_image.innerHTML = "IMAGE";
	container_status.innerHTML = "STATUS";
	container_state.innerHTML = "STATE";
	table.appendChild(container_id);
	table.appendChild(container_name);
	table.appendChild(container_image);
	table.appendChild(container_status);
	table.appendChild(container_state);
	return table;
}
/*const createTableHeaders = (table)=>{
	const container_action = document.createElement("th");
	container_action.innerHTML = "ACTION";
	const container_id = document.createElement("th");
	container_id.innerHTML = "CONTAINER ID";
	const container_name = document.createElement("th");
	container_name.innerHTML= "NAME";
	const container_image = document.createElement("th");
	container_image.innerHTML= "IMAGE";
	const container_status = document.createElement("th");
	container_status.innerHTML= "STATUS";
	table.appendChild(container_action);
	table.appendChild(container_id);
	table.appendChild(container_name);
	table.appendChild(container_image);
	table.appendChild(container_status);

}

const createTableRows = (table, lines)=>{
	for (let i = 0; i<=lines.length-2; i++){
		const table_row = document.createElement("tr");
		const data = lines[i].split(',');
		const stopProcess = document.createElement("td");
		stopProcess.innerHTML = "Stop"
		stopProcess.addEventListener('click', (e)=>{
			e.preventDefault();
			socket.emit('stop-container',data[0]);
			console.log(data[0]);
		})
		table_row.appendChild(stopProcess);
		for (let j = 0; j<=data.length-1; j++){
			const table_data = document.createElement("td");
			table_data.innerHTML = data[j];
			table_row.appendChild(table_data);
		}
		table.appendChild(table_row);
	}
}*/

socket.on("containers-sent", (containers)=>{
	button.innerHTML = "Update Container Statuses";
	if (containers.length>=1){
		//there are containers running
		const containers_table = createContainersTable();
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






