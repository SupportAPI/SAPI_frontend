import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { removeToken } from '../utils/cookies';

const useAuthStore = create(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId) => set({ userId }),
      logout: () => {
        set({ userId: null });
        removeToken();
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지 키 이름
    }
  )
);

export default useAuthStore;
