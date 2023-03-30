export const zoomIn = (delay, duration) => ({
	hidden: {
		scale: 0,
		opacity: 0,
	},
	show: {
		scale: 1,
		opacity: 1,
		transition: {
			type: 'spring',
			delay,
			duration,
			ease: 'easeOut',
		},
	},
})
