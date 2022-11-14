import React from 'react'
import {Link} from "react-router-dom"
import './TableRow.css'


const TableRow = (props) => {
	const cid = props.container.cid	
	const cname = props.container.cname 	
	const cimage = props.container.cimage	
	const cstate = props.container.cstate 
	const cstatus = props.container.cstatus
	return(
		<tr>
			<td>
				<Link style={{textDecoration:'none'}} to ={`/container/${cid}`}>{cid}</Link>	
			</td>
			<td>{cimage}</td>
			<td>{cname}</td>
			<td>{cstate}</td>
			<td>{cstatus}</td>
		</tr>
	)
}

export default TableRow
