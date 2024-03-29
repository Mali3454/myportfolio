import React from 'react'



const HeroText = ({ text }) => {
	return (
		<div className='box' id='heroText'>
			<h1 className='heroText__h1 '>
				<span className='text-plane heroText '>BEGINNER</span>
				<br></br>
				<span className='text-plane heroText'>FRONTEND</span>
				<br></br>
				<span className='text-plane heroText'>DEVELOPER </span>
				<br></br>
				<span className='text-plane heroText'>BASED IN</span>
				<br></br>
				<span className='text-plane heroText'>SZCZECIN</span>
			</h1>
		</div>
	)
}

export default HeroText
