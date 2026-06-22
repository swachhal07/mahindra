/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mahindra: {
          red: '#e31837',
          darkRed: '#b61218',
          black: '#0a0a0a',
          darkGray: '#121212',
          lightGray: '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['Eurostile', 'Saira', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
