import { create } from 'zustand';

export const useEnvironmentStore = create((set) => ({
  environments: [],
  setEnvironments: (environments) => set(environments),
}));
