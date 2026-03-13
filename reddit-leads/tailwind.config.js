/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#c9a96e',
          dark: '#0f0f0f',
          surface: '#1a1a1a',
          card: '#222222',
          border: '#2e2e2e',
          muted: '#666666',
          text: '#e5e5e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
