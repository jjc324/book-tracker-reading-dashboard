/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'book-brown': '#8B4513',
        'book-tan': '#D2B48C',
        'book-cream': '#F5F5DC',
        'book-dark': '#2C1810',
      },
      fontFamily: {
        'serif': ['Georgia', 'Times', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}