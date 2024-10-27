import { useState } from 'react';

export const useTabs = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const addTab = (id, name) => {
    const existingTab = tabs.find((tab) => tab.id === id);

    if (existingTab) {
      setActiveTab(existingTab.id); // 이미 있는 탭이면 활성화
    } else {
      const unlockedTab = tabs.find((tab) => !tab.isLocked); // 임시 탭 찾기

      if (unlockedTab) {
        // 임시 탭이 있다면 해당 탭을 업데이트
        setTabs((prev) => prev.map((tab) => (tab.id === unlockedTab.id ? { ...tab, id, name } : tab)));
        setActiveTab(id);
      } else {
        // 임시 탭이 없으면 새로운 임시 탭 생성
        const newTab = { id, name, isLocked: false };
        setTabs((prev) => [...prev, newTab]);
        setActiveTab(id);
      }
    }
  };

  const lockTab = (id) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, isLocked: true } : tab)));
  };

  const closeTab = (id) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTab === id) {
      const remainingTabs = tabs.filter((tab) => tab.id !== id);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[0].id : null);
    }
  };

  return {
    tabs,
    activeTab,
    addTab,
    lockTab,
    closeTab,
    setActiveTab,
  };
};