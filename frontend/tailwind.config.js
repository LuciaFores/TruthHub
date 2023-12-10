/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
	    themes: ["synthwave"],
	  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

