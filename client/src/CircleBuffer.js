import React from "react"

let  CircularBuffer = require("circular-buffer")
const CAPACITY = 5

const CircleBuffer = ()=>{
	let buf = new CircularBuffer(CAPACITY)
	buf.enq(0.0)
	console.log(buf)
	return (
		<p> You are cookei</p>
	)
}




export default CircleBuffer 
