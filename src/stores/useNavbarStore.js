import { create } from 'zustand';

export const useNavbarStore = create((set) => ({
  menu: '',
  apiData: [],
  setMenu: (menu) => set({ menu }),
  setApiData: (data) => set({ apiData: data }),
}));
