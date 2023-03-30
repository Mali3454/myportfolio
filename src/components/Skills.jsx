import React from 'react'

//import './curtains'
//import './skills.css'
import { css, html, node, git, react, js, ts, bootstrap, tailwind, sass } from '../assets/index'

const skills = [
	{
		name: 'HTML',
		img: html,
	},
	{
		name: 'CSS',
		img: css,
	},
	{
		name: 'Sass',
		img: sass,
	},
	{
		name: 'Javascript',
		img: js,
	},
	{
		name: 'Typescirpt',
		img: ts,
	},
	{
		name: 'React',
		img: react,
	},
	{
		name: 'Node',
		img: node,
	},
	{
		name: 'Git',
		img: git,
	},
	{
		name: 'Tailwind',
		img: tailwind,
	},
	{
		name: 'Bootstrap',
		img: bootstrap,
	},
]

const Skills = () => {
	return (
		<>
			<div id='planes' className='planes'>
				{skills.map(skill => (
					<div key={skill.name} className='plane-wrapper'>
						<div className='plane-inner'>
							<div className='plane skills__img'>
								<img className='plane skills__img1' data-sampler='planeTexture' src={skill.img} />
							</div>
							<span className='text-plane skills__span'>{skill.name}</span>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

export default Skills
