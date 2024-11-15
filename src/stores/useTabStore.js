import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTabStore = create(
  persist(
    (set) => ({
      openTabs: [],

      addTab: (tab) =>
        set((state) => {
          // `type`과 `id`가 모두 같은 탭이 있는지 확인 (type이 없으면 id만 비교)
          const existingTab = state.openTabs.find(
            (t) => t.id === tab.id && (t.type === tab.type || (!t.type && !tab.type)) // type이 없을 경우를 처리
          );

          if (existingTab) {
            // 이미 열려 있는 동일한 탭이 있다면 그대로 반환
            return state;
          }

          const tempTab = state.openTabs.find((t) => !t.confirmed);

          if (tempTab) {
            // 임시 탭이 있을 경우 해당 탭을 교체
            return {
              openTabs: state.openTabs.map((t) =>
                t.id === tempTab.id && (t.type === tempTab.type || (!t.type && !tempTab.type))
                  ? { ...tab, confirmed: false }
                  : t
              ),
            };
          }

          // 임시 탭이 없을 경우 새 탭을 추가
          return {
            openTabs: [...state.openTabs, { ...tab, confirmed: false }],
          };
        }),

      confirmTab: (tabId, tabType) =>
        set((state) => ({
          openTabs: state.openTabs.map((tab) =>
            tab.id === tabId && (tab.type === tabType || (!tab.type && !tabType)) ? { ...tab, confirmed: true } : tab
          ),
        })),

      removeTab: (tabId, tabType) =>
        set((state) => ({
          openTabs: state.openTabs.filter(
            (tab) => !(tab.id === tabId && (tab.type === tabType || (!tab.type && !tabType)))
          ),
        })),

      removeAllTabs: () => set({ openTabs: [] }),
    }),
    {
      name: 'tab-storage', // 로컬 스토리지 키 이름
    }
  )
);
