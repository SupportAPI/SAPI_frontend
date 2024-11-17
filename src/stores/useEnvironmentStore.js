import { create } from 'zustand';

export const useEnvironmentStore = create((set) => ({
  environment: [],
  setEnvironment: (environment) => set({ environment }), // 상태 객체로 전달
}));
