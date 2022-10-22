const createContainersTable = () =>{
	const table = document.createElement("table");
	table.setAttribute("id","containers_table");
	const container_id = document.createElement("th");
	const container_name = document.createElement("th");
	const container_image = document.createElement("th");
	const container_status = document.createElement("th");
	const container_state= document.createElement("th");
	const container_action= document.createElement("th");
	container_id.innerHTML = "ID";
	container_name.innerHTML = "NAME";
	container_image.innerHTML = "IMAGE";
	container_status.innerHTML = "STATUS";
	container_state.innerHTML = "STATE";
	container_action.innerHTML = "ACTION";
	table.appendChild(container_action);
	table.appendChild(container_id);
	table.appendChild(container_name);
	table.appendChild(container_image);
	table.appendChild(container_status);
	table.appendChild(container_state);
	return table;
}

const createTableRows = (table, containers)=>{
	for (let i = 0; i<containers.length; i++){
		const table_row = document.createElement("tr");
		const stopProcess = document.createElement("td");
		stopProcess.innerHTML = "Stop"
		stopProcess.addEventListener('click', (e)=>{
			e.preventDefault();
			socket.emit('stop-container',containers[i].Id);
			console.log(containers[i].Id);
		})
		table_row.appendChild(stopProcess);
		const container_id = document.createElement("td");
		const container_name = document.createElement("td");
		const container_image = document.createElement("td");
		const container_status = document.createElement("td");
		const container_state= document.createElement("td");
		container_id.innerHTML = containers[i].Id;
		container_name.innerHTML = containers[i].Names;
		container_image.innerHTML = containers[i].Image;
		container_status.innerHTML = containers[i].Status;
		container_state.innerHTML = containers[i].State;
		table_row.appendChild(container_id);
		table_row.appendChild(container_name);
		table_row.appendChild(container_image);
		table_row.appendChild(container_status);
		table_row.appendChild(container_state);
		table.appendChild(table_row);
	}
}
