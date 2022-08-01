/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      "poppins": ['Poppins', "sans-serif"],
    },
    extend: {
      screens: {
        "carouselWidth": "1200px",
      },
      colors: {
        "base": "#fb8304"
      },
      keyframes: {
        "progress": {
          '0%': {
            transform: "scaleX(0)"
          },
          "50%": {
            transform: "scaleX(0.5)"
          },
          "100%": {
            transform: "scaleX(1)"
          }
        }
      },
      animation: {
        progress: 'progress 1s ease-in-out',
      }
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require('@tailwindcss/forms'), require('flowbite/plugin')],
}
