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
	table.appendChild(container_id);
	table.appendChild(container_name);
	table.appendChild(container_image);
	table.appendChild(container_status);
	table.appendChild(container_state);
	table.appendChild(container_action);
	return table;
}

const createTableRows = (table, containers)=>{
	for (let i = 0; i<containers.length; i++){
		const table_row = document.createElement("tr");

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

		const container_actions = document.createElement("td");
		//container_actions.innerHTML = "Stop"

		const start_container = document.createElement("td");
		const stop_container  = document.createElement("td");
		const delete_container  = document.createElement("td");
		const unknown_action  = document.createElement("td");
		start_container.innerHTML = "start";
		stop_container.innerHTML = "stop";
		delete_container.innerHTML = "delete";
		unknown_action.innerHTML = "unknown";

		start_container.addEventListener('click', (e)=>{
			e.preventDefault();
			socket.emit('start-container',containers[i].Id);
			console.log("start " + containers[i].Id);
		})
		stop_container.addEventListener('click', (e)=>{
			e.preventDefault();
			socket.emit('stop-container',containers[i].Id);
			console.log("stop " + containers[i].Id);
		})
		delete_container.addEventListener('click', (e)=>{
			e.preventDefault();
			socket.emit('delete-container',containers[i].Id);
			console.log("delete " + containers[i].Id);
		})

		if (containers[i].State === "running"){
			container_actions.appendChild(stop_container);
		}else if (containers[i].State === "exited"){
			container_actions.appendChild(start_container);
			container_actions.appendChild(delete_container);
		}else{
			container_actions.appendChild(unknown_action);
		}
		table_row.appendChild(container_actions);

		table.appendChild(table_row);

	}
}
