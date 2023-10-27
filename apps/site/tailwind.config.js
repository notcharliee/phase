/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cubano': ['var(--font-cubano)'],
        'poppins': ['var(--font-poppins)'],
      },
      backgroundImage: {
        'phase': 'linear-gradient(45deg, #7000FF, #DB00FF)',
        'main-gif': 'url(/bg.gif)',
        'main-static': 'url(/bg.png)',
      },
    },
  },
  plugins: [],
}