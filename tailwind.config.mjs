/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js'
	],
	theme: {
		extend: {
			colors: {
				beige: '#fdfbe5',
				cream: '#f4e6b0',
				green_mm: '#43aa00',
				green_mm_hover: '#3c9801',
				plant: '#3baa61',
				brown: '#673c2e',
				yellow_mm: '#fee300',
				yellow_mm_hover: '#fdd300'
			},
			fontFamily: {
				'poppins': ['Poppins'],
				'anton': ['Anton']
			},
		}
	},
	plugins: [
		require('flowbite/plugin')
	],
}
