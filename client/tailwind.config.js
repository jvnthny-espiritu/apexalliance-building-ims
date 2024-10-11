/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        body:["Nunito Sans"]
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'darkGray' : '#808080',
        'lightGray' : '#F5F5F5',
        'primary': '#FF0000', // Renamed primary color
        'primary-light': '#ff2222',
        'primary-dark': '#ff6666',
        'facilities': {
          '1': '#0000FF',
          '2': '#008000',
          '3': '#FF0000',
          '4': '#3b82f6',
          '5': '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
