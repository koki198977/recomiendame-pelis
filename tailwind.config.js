/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5EFFF',
          100: '#E6D7FF',
          200: '#CFB1FF',
          300: '#B287FF',
          400: '#8F5CFF',
          500: '#6E3FFF',
          600: '#532FE0',
          700: '#3E22B4',
          800: '#2C1986',
          900: '#1A0F59',
          950: '#110A3B',
        },
        secondary: {
          50: '#FFF5FB',
          100: '#FFD9F1',
          200: '#FFB0E5',
          300: '#FF7DD8',
          400: '#FF4BCD',
          500: '#F321B6',
          600: '#C51198',
          700: '#98107A',
          800: '#6D0E5A',
          900: '#3D0435',
        },
        accent: {
          50: '#E7F7F9',
          100: '#C2EDF1',
          200: '#91DEE6',
          300: '#5CCFD9',
          400: '#2AB8C7',
          500: '#1997A8',
          600: '#127585',
          700: '#0D5664',
          800: '#073B45',
          900: '#04222A',
        },
        surface: {
          50: '#F6F5FB',
          100: '#E4E1F5',
          200: '#C9C4E5',
          300: '#A8A2D0',
          400: '#827DB8',
          500: '#645E9D',
          600: '#4B477D',
          700: '#37345E',
          800: '#252442',
          900: '#161529',
          950: '#0D0B19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
