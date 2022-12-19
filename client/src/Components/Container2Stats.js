import React ,{useCallback, useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import {useStream} from 'react-fetch-streams'
import axios from 'axios'
import {Link, useParams} from "react-router-dom"
import './ContainerStats.css'

const refresh_time = 1000;

const Container2Stats = () => {

	const {cid} = useParams()
	const {cstate} = useParams()
  const sample_time = 60

	const [cpu_usage, update_cpu_usage] = useState(cpu_usage_init)
	const [mem_usage, update_mem_usage] = useState(mem_usage_init)
	const [network_io, update_network_io] = useState(network_io_init)
	const [file_data, append_file_data] = useState([])
	const [data,set_data] = useState(init_data)

  useEffect(()=>{
    let counter = 0
		let controller = new AbortController();
    let timer_id = setInterval(()=>{
      if(cstate === "running"){
        axios.get(`/container_stats/${cid}`, {signal:controller.signal})
			    .then(response => {
					  update_cpu_usage(old_cpu_usage => old_cpu_usage.slice(1))
					  update_cpu_usage(old_cpu_usage => [...old_cpu_usage, {name:`${counter}`,val:calculate_CPU_usage(response.data)}])
					  update_mem_usage(old_mem_usage => old_mem_usage.slice(1))
					  update_mem_usage(old_mem_usage => [...old_mem_usage, {name:`${counter}`,val:calculate_memory_usage(response.data)}])
					  update_network_io(old_network_io => old_network_io.slice(1))
					  update_network_io(old_network_io => [...old_network_io, {name:`${counter}`,input:response.data.ni,output:response.data.no}])
            const file_data_entry = {
					    cpu_usage:calculate_CPU_usage(response.data),
					    mem_usage:calculate_memory_usage(response.data),
					    network_i:response.data.ni,
					    network_o:response.data.no,
            }
					  append_file_data(old_file_data => [...old_file_data, file_data_entry])
					  counter+=1
				})
				.catch(error => {
					console.log(error)
				})
      }
    },refresh_time)
    return ()=>{
			clearTimeout(timer_id);
			controller.abort();
    }
  },[])


	const generate_data_sample = ()=>{
		const fileData = JSON.stringify(file_data);
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
			<Tooltip content = {CPUToolTip} />
			<Line  isAnimationActive = {false} type="monotone" dataKey = "val" stroke="#8884d8"/>
		</LineChart>
		<p>Memory Usage Percentage</p>
		<LineChart width = {730} height = {250} data = {mem_usage}>
			<CartesianGrid strokeDasharray = "3 3" />
			<XAxis tick = {false} dataKey= "name" label = {{value: "60 seconds", position: 'insideBottomLeft'}}/>
			<YAxis type="number" domain={[0.00,100.00]}/>
			<Tooltip content = {MemoryToolTip}/>
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

//------------------Child Components ----------------------------
const CPUToolTip = ({active,payload,label})=>{
  if (active && payload && payload.length){
    return(
      <div className = "cpu_tool_tip">
        <p>{`${payload[0].value}%`}</p>
      </div>
    )
  }
}

const MemoryToolTip = ({active,payload,label})=>{
  if (active && payload && payload.length){
    return(
      <div className = "memory_tool_tip">
        <p>{`${payload[0].value}%`}</p>
      </div>
    )
  }
}



//------------------Utility Functions ----------------------------

const calculate_CPU_usage = (stats)=>{
  let cpu_usage = 0.00
	let cpu_delta = stats.ctu-stats.pctu
	let system_delta = stats.csu-stats.pcsu
  if (system_delta > 0.0 && cpu_delta > 0.0){
    cpu_usage = (cpu_delta/system_delta)*stats.oc*100.0
  }
  cpu_usage*=100.00
  return cpu_usage.toFixed(2)
}

const calculate_memory_usage = (stats)=>{
	let memory_usage = 0.00
	let memory_used = stats.mu - stats.mif + stats.maf
	memory_usage = memory_used/stats.ml*100.00
  return memory_usage.toFixed(2)
}

let cpu_usage_init = []
let mem_usage_init=[]
let network_io_init=[]

for (let i = 0; i<60 ; i++){
	cpu_usage_init.push({name:`${i}`,val:0})
	mem_usage_init.push({name:`${i}`,val:0})
	network_io_init.push({name:`${i}`,input:0,output:0})
}

const init_data = {
    // for cpu_usage_calculation
		ctu:0,pctu:0,csu:0,pcsu:0,oc:0,
    //memory_usage_calculation
		mu:0,mif:0,maf:0,ml:0,
    //network i/o calculation
		ni:0, no:0
}

export default Container2Stats
