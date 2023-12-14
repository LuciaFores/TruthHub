/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {
	    fontFamily: {
		'lexend': ['Lexend', 'sans-serif']
	      },
    },
  },
  daisyui: {
	    themes: ["synthwave"],
	  },
  plugins: [require("@tailwindcss/typography"), require("daisyui"), require("flowbite/plugin")],
}

