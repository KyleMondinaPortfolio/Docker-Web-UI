const socket = io();
const button = document.getElementById('display-containers');
const docker_information = document.getElementById('docker-information');

button.addEventListener("click", (e)=>{
	e.preventDefault();
	socket.emit("display-containers");
});

const createTableHeaders = (table)=>{
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
}

socket.on("container-data", (data)=>{
	button.innerHTML = "Update Container Statuses";
	let lines = data.split("\n");
	if (lines.length>1){
		//create the new updated table
		const table = document.createElement("table");
		table.setAttribute("id", "table");
		createTableHeaders(table);
		createTableRows(table,lines);
		//check if a table exists, if so, call replace instead of append
		const outdated_table = document.getElementById("table");
		if (outdated_table){
			docker_information.replaceChild(table,outdated_table);
		}else{
			const prev_containers = document.getElementById("no_containers");
			if(prev_containers){
				docker_information.replaceChild(table,prev_containers);
			}else{
				docker_information.appendChild(table);
			}
		}
	}
	else{
		//there are no running containers
		const prev_containers = document.getElementById("no_containers");
		const table = document.getElementById("table");
		const no_containers = document.createElement("h3");
		no_containers.innerHTML = "There are no containers running";
		no_containers.setAttribute("id","no_containers");
		if(prev_containers){
			docker_information.replaceChild(no_containers,prev_containers);
		}else{
			docker_information.appendChild(no_containers);
		}
		if (table){
			docker_information.replaceChild(no_containers,table);
		}

	}
	console.log(lines);
	console.log(lines.length);
})






