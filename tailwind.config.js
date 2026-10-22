/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#8ECFFF',
          black: '#080B12',
          white: '#F8FAFC',
          primary: '#8ECFFF',
          secondary: '#60B8F5',
          accent: '#268FE0',
          soft: '#EAF6FF',
          dark: '#080B12',
          darkSecondary: '#111827',
          light: '#F8FAFC',
          muted: '#94A3B8',
          border: '#263449',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
