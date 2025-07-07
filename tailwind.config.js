/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}"
	],
	theme: {
		extend: {
			colors: {},
			fontFamily: {
				anton: ['Anton SC'],
				alata: ['Alata'],
			}
		},
	},
	plugins: [
		function ({addUtilities}) {
			addUtilities(
				{
					'.c-w-full > *': {
						width: '100%',
					},
				},
				{
					layer: "utilities"
				}
			)
		},
	],
}
