import { create } from 'zustand';
import { removeToken } from '../utils/cookies';

const useAuthStore = create((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
  logout: () => {
    set({ userId: null });
    removeToken();
  },
}));

export default useAuthStore;
