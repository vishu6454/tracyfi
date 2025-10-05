// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'light-bg': "url('./assets/background.jpg')",
        'dark-bg': "url('./assets/background2.jpg')",
      }
    },
  },
  plugins: [],
}