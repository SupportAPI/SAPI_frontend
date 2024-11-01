import { create } from 'zustand';

export const useTabStore = create((set) => ({
  openTabs: [],

  addTab: (tab) =>
    set((state) => {
      const existingTab = state.openTabs.find((t) => t.id === tab.id);
      if (existingTab) {
        // 이미 열려 있는 탭이 있다면 상태 변경 없이 반환
        return state;
      }

      const tempTab = state.openTabs.find((t) => !t.confirmed);

      if (tempTab) {
        // 임시 탭이 있을 경우 해당 탭을 교체
        return {
          openTabs: state.openTabs.map((t) => (t.id === tempTab.id ? { ...tab, confirmed: false } : t)),
        };
      }

      // 임시 탭이 없을 경우 새 탭을 추가
      return {
        openTabs: [...state.openTabs, { ...tab, confirmed: false }],
      };
    }),

  confirmTab: (tabId) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) => (tab.id === tabId ? { ...tab, confirmed: true } : tab)),
    })),

  removeTab: (tabId) =>
    set((state) => ({
      openTabs: state.openTabs.filter((tab) => tab.id !== tabId),
    })),
}));
