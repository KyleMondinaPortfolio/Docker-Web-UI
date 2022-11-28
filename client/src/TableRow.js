import React from 'react'
import {Link} from "react-router-dom"
import './TableRow.css'


const TableRow = (props) => {
	const cid = props.container.cid	
	const cname = props.container.cname 	
	const cimage = props.container.cimage	
	const cstate = props.container.cstate 
	const cstatus = props.container.cstatus
	const handler = props.handler
	return(
		<tr>
			<td><button onClick = {()=>{handler(cid)}}></button></td>
			<td>
				<Link style={{textDecoration:'none'}} to ={`/container/${cid}/${cstate}`}>{cid}</Link>	
			</td>
			<td>{cname}</td>
			<td>{cimage}</td>
			<td>{cstate}</td>
			<td>{cstatus}</td>
		</tr>
	)
}

export default TableRow
