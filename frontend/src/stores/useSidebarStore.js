import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  expandedCategories: {},

  // 특정 카테고리를 강제로 열기
  expandCategory: (category) =>
    set((state) => ({
      expandedCategories: {
        ...state.expandedCategories,
        [category]: true, // 해당 카테고리를 항상 열리도록 설정
      },
    })),

  // 기존 카테고리 열림/닫힘 토글 함수
  toggleCategory: (category) =>
    set((state) => ({
      expandedCategories: {
        ...state.expandedCategories,
        [category]: !state.expandedCategories[category],
      },
    })),

  setAllCategories: (categories, isExpanded) =>
    set(() => {
      const newExpanded = {};
      categories.forEach((category) => {
        newExpanded[category.category] = isExpanded;
      });
      return { expandedCategories: newExpanded };
    }),
}));
