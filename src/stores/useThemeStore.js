import { create } from 'zustand';

const useThemeStore = create((set) => ({
  // 초기 상태 설정: 시스템 설정 또는 로컬 스토리지 기반
  theme: localStorage.getItem('theme') || 'light',

  // 테마를 전환하는 메서드
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';

      // HTML 태그에 다크 모드 클래스 적용/제거
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      localStorage.setItem('theme', newTheme);

      return { theme: newTheme };
    }),

  // 테마를 명시적으로 설정하는 메서드
  setTheme: (theme) =>
    set(() => {
      // HTML 태그에 다크 모드 클래스 적용/제거
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 로컬 스토리지에 테마 저장
      localStorage.setItem('theme', theme);

      return { theme };
    }),
}));

export default useThemeStore;
