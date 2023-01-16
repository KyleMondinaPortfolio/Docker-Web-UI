import {
	createBrowserRouter,
	RouterProvider,
	Route,
} from "react-router-dom";
import Containers from './Components/Containers.js'
import Container from './Components/Container.js'
import ContainerLogs from './Components/ContainerLogs.js'
import ContainerInfo from './Components/ContainerInfo.js'
import ContainerStats from './Components/ContainerStats.js'
import Container2Stats from './Components/Container2Stats.js'
import "./App.css"


const router = createBrowserRouter([
	{
		path:"/",
		element:<Containers/>,
	},
	{
		path:"/container/:cid/:cstate/:cname",
		element:<Container/>,
		children:[

			{
				path:"",
				element:<ContainerInfo/>,
			},
			{
				path:"containerInfo/:cstate/:cid",
				element:<ContainerInfo/>,
			},
			{
				path:"containerLogs/:cstate/:cid",
				element:<ContainerLogs/>,
			},
			{
				path:"containerStats/:cstate/:cid",
				element:<Container2Stats/>,
			}
		]
	},

])

const App = () => {
	return (
		<div class = "app-wrapper">
		   <div class = "app-header">
          <img src={require("./assets/advantest-logo.png")}/>
		      <h1>Docker Containers Monitor:</h1>
		   </div>
	           <div class = "app-content">
		      <RouterProvider router = {router} />
		   </div>
		</div> 
	)

}

export default App
