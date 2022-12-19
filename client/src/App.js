import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import Containers from './Components/Containers.js'
import Container from './Components/Container.js'
import ContainerLogs from './Components/ContainerLogs.js'
import ContainerStats from './Components/ContainerStats.js'
import "./App.css"


const router = createBrowserRouter([
	{
		path:"/",
		element:<Containers/>,
	},
	{
		path:"/container/:cid/:cstate",
		element:<Container/>,
		children:[

			{
				path:"",
				element:<ContainerLogs/>,
			},
			{
				path:"containerLogs/:cstate/:cid",
				element:<ContainerLogs/>,
			},
			{
				path:"containerStats/:cstate/:cid",
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
