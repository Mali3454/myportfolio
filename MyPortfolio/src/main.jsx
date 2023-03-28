import React from 'react'
import ReactDOM from 'react-dom/client'

import HeroText from './components/HeroText'
import Navbar from './components/Navbar'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Heading from './components/Heading'
//import './components/curtain'
import './components/curtain'

import './index.css'
import './fonts/MonumentExtended-FreeForPersonalUse/MonumentExtended-Ultrabold.otf'
import Contact from './components/Contact'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<div id='canvas'></div>

		<div id='content'>
			<Navbar />
			<HeroText />
			<About />
			<Heading text='Skills' />
			<Skills />
			<Heading text='Projects' />
			<Projects />
			<Heading text='Contact' />
			<Contact />
		</div>
	</React.StrictMode>
)
