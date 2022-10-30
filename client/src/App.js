import DisplayContainers from './DisplayContainers.js'

const App = () => {
	return (
		<div id = "app-wrapper">
			<h1 style = {{color:'maroon'}}>Docker Containers Monitor:</h1>
			<DisplayContainers></DisplayContainers>
		</div> 
	)

}

export default App
