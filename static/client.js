const socket = io();
const button = document.getElementById('myButton');

button.addEventListener("click", (e)=>{
	e.preventDefault();
	socket.emit("button-clicked");
});






