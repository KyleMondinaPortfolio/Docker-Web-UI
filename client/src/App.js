import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import DisplayContainers from './DisplayContainers.js'
import ContainerLogs from './ContainerLogs.js'


const router = createBrowserRouter([
	{
		path:"/",
		element:<DisplayContainers/>,
	},
	{
		path:"/containerLogs/:cid",
		element:<ContainerLogs/>,
	},
])

const App = () => {
	return (
		<div id = "app-wrapper">
			<h1 style = {{color:'maroon'}}>Docker Containers Monitor:</h1>
			<RouterProvider router = {router} />
		</div> 
	)

}

export default App
