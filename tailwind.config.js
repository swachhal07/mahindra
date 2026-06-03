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
          red: '#e21b22',
          darkRed: '#b61218',
          black: '#0a0a0a',
          darkGray: '#121212',
          lightGray: '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
