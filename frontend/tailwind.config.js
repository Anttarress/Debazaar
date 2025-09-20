/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#0088cc',
          bg: '#17212b',
          secondary: '#242f3d',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
