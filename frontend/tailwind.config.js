/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

