import { create } from 'zustand';

export const useEnvironmentStore = create((set) => ({
  environments: [],
  setEnvironment: (environments) => set({ environments }), // 상태 객체로 전달
}));
