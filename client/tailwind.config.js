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
        'primary': '#041527',
        'room-use': {
          'laboratory': '#8a4cf2',
          'classroom': '#10b981',
          'administrative': '#ec4899',
          'available': '#3b82f6',
          'notavailable': '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
