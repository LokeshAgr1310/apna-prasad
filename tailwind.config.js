/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    // "./node_modules/flowbite/**/*.js",
    './src/**/*.{html,js}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    fontFamily: {
      "poppins": ['Poppins', "sans-serif"],
    },
    screens: {
      xs: "320px",
      sm: "576px",
      md: '768px',
      lg: '976px',
      xl: "1176px",
      "2xl": '1440px',
    },
    extend: {
      screens: {
        "carouselWidth": "1200px",
      },
      colors: {
        "primary": "#fb8304"
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
  plugins: [
    require("@tailwindcss/line-clamp"),
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    require('tw-elements/dist/plugin')
  ],
}
