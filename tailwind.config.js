/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0A0A0A',
          lighter: '#111111',
        },
      },
    },
  },
  plugins: [],
};