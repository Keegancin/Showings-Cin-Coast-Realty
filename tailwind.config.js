/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#c9a96e',
        'brand-gold-light': '#d4b896',
        'brand-dark': '#0d0d0d',
        'brand-gray': '#1a1a1a',
        'brand-border': '#2a2a2a',
        'brand-text': '#888888',
        'brand-text-light': '#aaaaaa',
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
