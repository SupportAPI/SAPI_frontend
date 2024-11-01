import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
  clearUserId: () => set({ userId: null }),
}));

export default useAuthStore;
