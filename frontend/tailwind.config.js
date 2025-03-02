module.exports = {
  darkMode: 'media', // Uses system preference for light/dark mode
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
