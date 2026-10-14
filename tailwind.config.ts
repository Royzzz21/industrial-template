import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          DEFAULT: '#14283A',
          50: '#F3F5F7',
          100: '#E3E8EC',
          200: '#C5CED6',
          300: '#9BAAB7',
          400: '#5C6F81',
          500: '#44596C',
          600: '#2E4256',
          700: '#213447',
          800: '#14283A',
          900: '#0C1A27',
        },
        graphite: '#2B3A45',
        concrete: '#EEF1F3',
        safety: { DEFAULT: '#F26A1B', 600: '#D9560E', 700: '#A8420B', 100: '#FDE6D8' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['Barlow', 'Arial', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [forms],
} satisfies Config
