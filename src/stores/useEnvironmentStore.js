import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEnvironmentStore = create(
  persist(
    (set) => ({
      environments: [], // 초기값
      setEnvironments: (environments) => set({ environments }),
    }),
    {
      name: 'environment-storage', // 로컬 스토리지 키 이름
    }
  )
);
