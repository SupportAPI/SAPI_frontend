/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 다크 모드를 'class' 기반으로 활성화
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // Tailwind가 스캔할 경로
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard-Regular', 'sans-serif'],
      },
      colors: {
        light: {
          background: '#FFFFFF', // 라이트 모드 배경
          surface: '#F7F7F7', // 라이트 모드 서피스 색상
          text: '#121212', // 라이트 모드 텍스트
          accent: '#2563EB', // 라이트 모드 강조 색상 (파랑)
          danger: '#EF4444', // 라이트 모드 경고 색상 (빨강)
        },
        dark: {
          background: '#262626', // 다크 모드 배경
          surface: '#1E1E1E', // 다크 모드 서피스 색상
          text: '#E4E4E4', // 다크 모드 기본 텍스트
          mutedText: '#A3A3A3', // 다크 모드 보조 텍스트
          accent: '#3B82F6', // 다크 모드 강조 색상 (파랑)
          danger: '#F87171', // 다크 모드 경고 색상 (연한 빨강)
          hover: '#4B5563',
        },
      },
    },
  },
  plugins: [],
};
