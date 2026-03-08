/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        brand: {
          DEFAULT: '#C00021',
          50: '#fef2f3',
          100: '#fde6e8',
          500: '#C00021',
          600: '#a8001c',
          700: '#900018',
          800: '#780014',
          900: '#600010',
        },
      },
    },
  },
  plugins: [],
};
