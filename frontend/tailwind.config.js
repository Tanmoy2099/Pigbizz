/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/**/*.{js,ts,jsx,tsx}'],

  daisyui: {
    base: false
  },
  theme: {
    extend: {
      //   backgroundImage: {
      //     'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //     'gradient-conic':
      //       'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      //   },
      colors: {
        // ...colors,
        primary: '#9155FD',
        'primary-25': '#9155FD40',
        'primary-deep': 'rgba(145, 85, 253, 0.75)'
      }
    },
    boxShadow: {
      card: '0px 0px 15px 1.5px rgba(0, 0, 0, 0.08)'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    }
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  safelist: [
    {
      pattern: /(bg|text|border|btn)-*/
    }
  ]
}
