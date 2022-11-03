import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import DisplayContainers from './DisplayContainers.js'
import Container from './Container.js'
import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'


const router = createBrowserRouter([
	{
		path:"/",
		element:<DisplayContainers/>,
	},
	{
		path:"/container/:cid",
		element:<Container/>,
		children:[

			{
				path:"",
				element:<ContainerLogs/>,
			},
			{
				path:"containerLogs/:cid",
				element:<ContainerLogs/>,
			},
			{
				path:"containerStats/:cid",
				element:<ContainerStats/>,
			}
		]
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
