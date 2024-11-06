import { create } from 'zustand';

export const useAlarmStore = create((set) => ({
  received: false,
  setReceived: (received) => set({ received }),
}));
