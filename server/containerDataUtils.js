
const trimContainer = (container) => {
	return {
		cid:container.Id,
		cname:container.Names[0].slice(1),
		cimage:container.Image,
		cstate:container.State,
		cstatus:container.Status,
	}
}

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
		ml:container_stats.memory_stats.limit
		
	}
} 


module.exports = {trimContainer, trimContainerStats}


