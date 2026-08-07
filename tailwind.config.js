/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FCF8F3',
        ink: '#191919',
        mint: '#9EDFD1',
        yellowSoft: '#F4E59A',
        blueSoft: '#A8DCE8',
        roseCream: '#F3E7E3',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        product: '0 24px 60px rgba(25, 25, 25, 0.12)',
      },
    },
  },
  plugins: [],
}
