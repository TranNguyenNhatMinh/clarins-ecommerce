/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        brand: {
          DEFAULT: '#B91C3C',
          50: '#fef2f3',
          100: '#fde6e9',
          200: '#fbd0d7',
          300: '#f7aab5',
          400: '#f17a8c',
          500: '#e63f5c',
          600: '#B91C3C',
          700: '#9b1632',
          800: '#82152c',
          900: '#70162a',
        },
        admin: {
          surface: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#6B7280',
          text: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        admin: '0.75rem',
        'admin-lg': '1rem',
      },
      boxShadow: {
        admin: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'admin-md': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'admin-lg': '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};
