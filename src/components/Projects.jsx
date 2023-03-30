import React from 'react'

import { transactionHistory, portfolio } from '../assets'

const projects = [
	{
		name: 'Portfolio Website',
		img: portfolio,
		description: 'A website created using React, CurtainsJs, and WebGL. Inspired by the work of Martin Laxenaire.',
		link: 'https://www.google.com/',
	},
	{
		name: 'History Transaction',
		img: transactionHistory,
		description:
			'An application that allows user registration and login, and displays transaction history to logged-in users. The application is created in pure JavaScript and is built as a Single Page Application.',
		link: 'https://www.google.com/',
	},
]

const Projects = () => {
	return (
		<>
			<div id='planes' className='projects'>
				{projects.map(project => (
					<div key={project.name} className='project-wrapper'>
						<a href={project.link}>
							<div className='project-inner'>
								<div className='plane project__img'>
									<img className='plane project__img1 ' data-sampler='planeTexture' src={project.img} />
								</div>
								<div className='project__text'>
									<span className='text-plane project__span'>{project.name}</span>
									<p className='text-plane project__p'>{project.description}</p>
								</div>
							</div>
						</a>
					</div>
				))}
			</div>
		</>
	)
}

export default Projects
