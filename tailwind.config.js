/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
      },
      fontFamily: {
        sans: ['Pretendard-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
