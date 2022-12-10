import React ,{useCallback, useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios'
import {useStream} from 'react-fetch-streams'
import {Link, useParams} from "react-router-dom"
import './ContainerStats.css'

const REFRESH_TIME = 1000;

const trimContainerStats = (container_stats)=>{
	return {
		//cpu usage
		ctu:container_stats.cpu_stats.cpu_usage.total_usage,	
		pctu:container_stats.precpu_stats.cpu_usage.total_usage,
		csu:container_stats.cpu_stats.system_cpu_usage,
		pcsu:container_stats.precpu_stats.system_cpu_usage,
		oc:container_stats.cpu_stats.online_cpus,
		//memory usage
		mu: container_stats.memory_stats.usage,
		mif:container_stats.memory_stats.stats.inactive_file,
		maf:container_stats.memory_stats.stats.active_file,
		ml:container_stats.memory_stats.limit,
		//network usage
		ni: container_stats.networks.eth0.rx_bytes,
		no: container_stats.networks.eth0.tx_bytes
		
	}
}

const calculateCPUPercent = (stats) =>{
	let cpuPercent = 0.00;
	let cpuDelta = stats.ctu-stats.pctu;
	let systemDelta = stats.csu-stats.pcsu;
	if (systemDelta > 0.0 && cpuDelta > 0.0){
		cpuPercent = (cpuDelta/systemDelta)*stats.oc*100.0;
	}
	return cpuPercent * 100.00; 
}

const calculateMemPercent = (stats)=>{
	let mem_percent = 0.00;
	let mem_used = stats.mu - stats.mif + stats.maf;
	mem_percent = mem_used/stats.ml*100.00;
	return mem_percent * 100.00; 
}

let cpu_usage_init = []
let mem_usage_init=[]
let network_io_init=[]
for (let i = 0; i<60 ; i++){
	cpu_usage_init.push({name:`${i}`,val:0});
	mem_usage_init.push({name:`${i}`,val:0});
	network_io_init.push({name:`${i}`,input:0,output:0});
}

const ContainerStats = () => {
	const {cid} = useParams();
	const {cstate} = useParams();
	const capacity = 60
	const [cpu_usage, update_cpu_usage] = useState(cpu_usage_init)
	const [mem_usage, update_mem_usage] = useState(mem_usage_init)
	const [network_io, update_network_io] = useState(network_io_init)
	const [raw_data, update_raw_data] = useState([])
	const [data,setData] = useState({
		//used for cpu percentage calculation
		ctu:0,pctu:0,csu:0,pcsu:0,oc:0,
		//used for memory percentage calculation
		mu:0,mif:0,maf:0,ml:0,
		//used for network
		ni:0, no:0
		
	});

	useEffect(()=>{
		let counter = 0;
		let controller = new AbortController();
		let timerId = setInterval(()=>{
			if (cstate === "running"){
			axios.get(`/container_stats_raw/${cid}`, {signal:controller.signal})
				.then(response => {
					const formatted_data = trimContainerStats(response.data);
					const data = {
					   cpu_usage:calculateCPUPercent(formatted_data),
					   mem_usage:calculateMemPercent(formatted_data),
					   network_i:formatted_data.ni,
					   network_o:formatted_data.no,
					};
					//update_raw_data(old_raw_data => [...old_raw_data, response.data])
					update_raw_data(old_raw_data => [...old_raw_data, data])
				})
				.catch(error => {
					console.log(error);
				})
			axios.get(`/container_stats/${cid}`, {signal:controller.signal})
				.then(response => {
					update_cpu_usage(old_cpu_usage => old_cpu_usage.slice(1))
					update_cpu_usage(old_cpu_usage => [...old_cpu_usage, {name:`${counter}`,val:calculateCPUPercent(response.data)}])
					update_mem_usage(old_mem_usage => old_mem_usage.slice(1))
					update_mem_usage(old_mem_usage => [...old_mem_usage, {name:`${counter}`,val:calculateMemPercent(response.data)}])
					update_network_io(old_network_io => old_network_io.slice(1))
					update_network_io(old_network_io => [...old_network_io, {name:`${counter}`,input:response.data.ni, output:response.data.no}])
					counter = counter +1
				})
				.catch(error => {
					console.log(error)
				})
			}

		},REFRESH_TIME)
		return ()=>{
			clearTimeout(timerId);
			controller.abort();
		}
	},[])

	const generate_data_sample = ()=>{
		const fileData = JSON.stringify(raw_data);
		const blob = new Blob([fileData], {type: "text/plain"});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "data_sample.json";
		link.href = url;
		link.click();
	}


	return( 		
		<div class = "container_stats">
			
		<p>CPU Usage Percentage</p>
		<LineChart width = {730} height = {250} data = {cpu_usage}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis tick={false} dataKey= "name" label = {{value: "60 seconds", position: 'insideBottomLeft'}}/>
			<YAxis type="number" domain={[0.00,100.00]}/>
			<Tooltip/>
			<Line  isAnimationActive = {false} type="monotone" dataKey = "val" stroke="#8884d8"/>
		</LineChart>
		<p>Memory Usage Percentage</p>
		<LineChart width = {730} height = {250} data = {mem_usage}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis tick = {false} dataKey= "name" label = {{value: "60 seconds", position: 'insideBottomLeft'}}/>
			<YAxis type="number" domain={[0.00,100.00]}/>
			<Tooltip/>
			<Line isAnimationActive = {false} type="monotone" dataKey = "val" stroke="#8884d8"/>
		</LineChart>
		<p>Network I/O</p>
		<LineChart width = {730} height = {250} data = {network_io}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis tick = {false} dataKey= "name" label = {{value: "60 seconds", position: 'insideBottomLeft'}}/>
			<YAxis type="number" domain={[0.00,100000.00]}/>
			<Tooltip/>
			<Line isAnimationActive = {false} type="monotone" dataKey = "input" stroke="#8884d8"/>
			<Line isAnimationActive = {false} type="monotone" dataKey = "output" stroke="#fc0339"/>
		</LineChart>
		
		<button onClick = {()=>{generate_data_sample()}}>Download Container Stats</button>
		
		
		</div>
	)
}

export default ContainerStats
