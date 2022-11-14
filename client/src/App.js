import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import AllContainers from './AllContainers.js'
import Container from './Container.js'
import ContainerLogs from './ContainerLogs.js'
import ContainerStats from './ContainerStats.js'
import "./App.css"


const router = createBrowserRouter([
	{
		path:"/",
		element:<AllContainers/>,
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
		<div class = "app-wrapper">
		   <div class = "app-header">
		      <h1>Docker Containers Monitor:</h1>
		   </div>
	           <div class = "app-content">
		      <RouterProvider router = {router} />
		   </div>
		</div> 
	)

}

export default App
