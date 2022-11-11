import React ,{useCallback, useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios'
import {useStream} from 'react-fetch-streams'
import {Link, useParams} from "react-router-dom"
import './TableRow.css'

const REFRESH_TIME = 1000;

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
	let mem_percent = 0;
	let mem_used = stats.mu - stats.mif + stats.maf;
	mem_percent = mem_used/stats.ml*100.00;
	return mem_percent 
}


const ContainerStats = () => {
	const {cid} = useParams();
	const capacity = 60
	const [cpuRecords, updateCPURecords] = useState([])
	const [memRecords, updateMemRecords] = useState([])
	const [data,setData] = useState({
		//used for cpu percentage calculation
		ctu:0,pctu:0,csu:0,pcsu:0,oc:0,
		//used for memory percentage calculation
		mu:0,mif:0,maf:0,ml:0
		
	});

	useEffect(()=>{
		let counter = 0;
		let controller = new AbortController();
		let timerId = setInterval(()=>{
			axios.get(`/container_stats/${cid}`, {signal:controller.signal})
				.then(response => {
					if (counter >  capacity){
						console.log("what is coutner from counter > capacity: " + counter)
						updateCPURecords(oldRecords => oldRecords.slice(1)) 	
						updateMemRecords(oldRecords => oldRecords.slice(1)) 	
						updateCPURecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateCPUPercent(response.data)}]) 	
						updateMemRecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateMemPercent(response.data)}]) 	
					}else{
						console.log("what is coutner from counter <= capacity: " + counter)
						updateCPURecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateCPUPercent(response.data)}]) 	
						updateMemRecords(oldRecords => [...oldRecords,{name:`${counter}`, val:calculateMemPercent(response.data)}]) 	
					}
					counter = counter +1
				})
				.catch(error => {
					console.log(error)
				})

		},REFRESH_TIME)
		return ()=>{
			clearTimeout(timerId);
			controller.abort();
		}
	},[])


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
