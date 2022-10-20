const socket = io();
const button = document.getElementById('display-containers');
const container_labels = document.getElementById('container-labels');
const containers = document.getElementById('containers');

button.addEventListener("click", (e)=>{
	e.preventDefault();
	socket.emit("display-containers");
});

socket.on("container-data", (data)=>{
	console.log(data);
	let lines = data.split("\n");
	container_labels.innerHTML = lines[0]
	containers.innerHTML = lines[1];
})






