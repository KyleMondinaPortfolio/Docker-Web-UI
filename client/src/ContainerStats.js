import React ,{useCallback, useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios'
import {useStream} from 'react-fetch-streams'
import {Link, useParams} from "react-router-dom"
import './TableRow.css'

//need to add a trimming data here

const trimContainerStatsData = (container_stats)=>{
	return {
		ctu:container_stats.cpu_stats.cpu_usage.total_usage,	
		pctu:container_stats.precpu_stats.cpu_usage.total_usage,
		csu:container_stats.cpu_stats.system_cpu_usage,
		pcsu:container_stats.precpu_stats.system_cpu_usage,
		oc:container_stats.cpu_stats.online_cpus,
		//memory usage
		mu: container_stats.memory_stats.usage,
		//memory cache
		mif:container_stats.memory_stats.stats.inactive_file,
		//memory active file
		maf:container_stats.memory_stats.stats.active_file,
		//memory limit
		ml:container_stats.memory_stats.limit
		
	}
} 

//ctu = cpu_total_usage, abbreviations from ^
const calculateCPUPercent = (stats) =>{
	let cpuPercent = 0.0;
	let cpuDelta = stats.ctu-stats.pctu;
	let systemDelta = stats.csu-stats.pcsu;
	if (systemDelta > 0.0 && cpuDelta > 0.0){
		cpuPercent = (cpuDelta/systemDelta)*stats.oc*100.0;
	}
	return cpuPercent; 
}

const calculateMemPercent = (stats)=>{
	let mem_used = stats.mu - stats.mif + stats.maf;
	let mem_percent = mem_used/stats.ml*100.00;
	
	return mem_percent 
}


const ContainerStats = () => {
	const refresh_time = 1000;
	const {cid} = useParams();
	const capacity = 7
	const [cpuRecords, updateCPURecords] = useState([])
	const [memRecords, updateMemRecords] = useState([])
	const [counter, updateCounter] = useState(0)
	const [data,setData] = useState({
		//used for cpu percentage calculation
		ctu:0,
		pctu:0,
		csu:0,
		pcsu:0,
		oc:0,
		//used for memory percentage calculation
		mu:0,
		mif:0,
		maf:0,
		ml:0
		
	});
	setInterval(()=>{
		axios(`/container_stats/${cid}`)
			.then(response => {
				//updateContainers(response.data.map(trimContainerData));
				setData(trimContainerStatsData(response.data));
			})
			.catch(error => console.log(error))

	},refresh_time)

	useEffect(()=>{
		if (counter >  capacity){
			updateCPURecords(oldRecords => oldRecords.slice(1)) 	
			updateMemRecords(oldRecords => oldRecords.slice(1)) 	
			updateCPURecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateCPUPercent(data)}]) 	
			updateMemRecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateMemPercent(data)}]) 	
		}else{
			updateCPURecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateCPUPercent(data)}]) 	
			updateMemRecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateMemPercent(data)}]) 	
		}
		updateCounter(counter+1)
		
	},[data]);
	return( 		
		<div>
		<p>CPU Percentage</p>
		<p>{calculateCPUPercent(data)}</p>
		<LineChart width = {730} height = {250} data = {cpuRecords}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis dataKey= "name"/>
			<YAxis type="number" domain={[0,1]}/>
			<Tooltip/>
			<Line type="monotone" dataKey = "val" stroke="#8884d8"/>
		</LineChart>
		<p>Mem Percentage</p>
		<p>{calculateMemPercent(data)}</p>
		<LineChart width = {730} height = {250} data = {memRecords}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis dataKey= "name"/>
			<YAxis type="number" domain={[0,1]}/>
			<Tooltip/>
			<Line type="monotone" dataKey = "val" stroke="#8884d8"/>
		</LineChart>
		</div>
	)
}

export default ContainerStats
