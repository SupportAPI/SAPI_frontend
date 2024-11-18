import { create } from 'zustand';

export const useTestStore = create((set) => ({
  testUrl: '',
  setTestUrl: (testUrl) => set({ testUrl }),
}));
