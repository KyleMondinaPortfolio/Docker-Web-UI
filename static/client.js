const socket = io();
const button = document.getElementById('display-containers');
const docker_information = document.getElementById('docker-information');
//const container_labels = document.getElementById('container-labels');
//const containers = document.getElementById('containers');

button.addEventListener("click", (e)=>{
	e.preventDefault();
	socket.emit("display-containers");
});

const createTableHeaders = (table,labels)=>{
	const container_id = document.createElement("th");
	container_id.innerHTML = "CONTAINER ID";
	const container_name = document.createElement("th");
	container_name.innerHTML= "NAME";
	const container_image = document.createElement("th");
	container_image.innerHTML= "IMAGE";
	const container_status = document.createElement("th");
	container_status.innerHTML= "STATUS";
	table.appendChild(container_id);
	table.appendChild(container_name);
	table.appendChild(container_image);
	table.appendChild(container_status);

}

socket.on("container-data", (data)=>{
	button.innerHTML = "Update Container Statuses";
	let lines = data.split("\n");
	if (lines.length>1){
		//create the new updated table
		const table = document.createElement("table");
		table.setAttribute("id", "table");
		createTableHeaders(table,lines[0]);
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
	/*if (lines.length>2){
		//there are running processeses
		const container_labels = document.createElement("p");
		container_labels.innerHTML = lines[0];
		const container_headers = lines[1].split("   ");
		const container_headers1 = lines[1].split("\v");
		const container_headers2 = lines[1].split("\n");
		const container_headers3 = lines[0].split("       ");
		console.log(container_headers.length);
		console.log(container_headers);
		console.log(container_headers1);
		console.log(container_headers2);
		console.log(container_headers3);
		docker_information.appendChild(container_labels);
		for (let i = 1; i<= lines.length-1; i++){
			const table_row = document.createElement("tr");
			table_row.innerHTML = lines[i];
			table.appendChild(table_row);
		}
		docker_information.appendChild(table);
	}else{
		//there are no running processes
		const blank_display = document.createElement("p");
		blank_display.innerHTML = "There are currently no containers running";
		docker_information.appendChild(blank_display);
	}*/
})






