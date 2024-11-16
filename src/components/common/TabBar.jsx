import { useTabStore } from '../../stores/useTabStore';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

const TabBar = () => {
  const { openTabs, confirmTab, removeTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams(); // workspaceId 가져오기

  const currentPath = location.pathname;

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const handleTabDoubleClick = (tabId) => {
    confirmTab(tabId);
  };

  const handleTabClose = (tabId) => {
    const tabIndex = openTabs.findIndex((tab) => tab.id === tabId);
    const isActiveTab = openTabs[tabIndex].path === currentPath;

    // 탭을 먼저 제거
    removeTab(tabId);

    // 탭이 활성화된 상태에서 닫혔다면, 다른 탭을 활성화
    if (isActiveTab) {
      // 닫은 탭의 왼쪽에 있는 탭으로 이동 (탭이 남아있다면)
      if (tabIndex > 0) {
        const previousTab = openTabs[tabIndex - 1];
        navigate(previousTab.path);
      }
      // 닫은 탭의 오른쪽에 있는 탭으로 이동 (탭이 남아있다면)
      else if (tabIndex === 0 && openTabs.length > 1) {
        const nextTab = openTabs[1];
        navigate(nextTab.path);
      }
      // 모든 탭이 닫혔다면 기본 경로로 이동
      else if (openTabs.length === 1) {
        navigate(`/workspace/${workspaceId}`);
      }
    }
  };

  return (
    <div className='flex bg-white dark:bg-dark-background border-b h-10'>
      {openTabs.map((tab) => {
        const isActive = currentPath === tab.path;

        return (
          <div
            key={tab.id}
            className={`flex items-center cursor-pointer relative px-2 h-10 dark:bg-dark-background   ${
              isActive ? 'bg-white border-t-2 border-gray-800 dark:border-white' : 'bg-gray-100 border-b'
            }`}
            onClick={() => handleTabClick(tab)}
            onDoubleClick={() => handleTabDoubleClick(tab.id)}
            style={{
              width: '150px',
              flexShrink: 0,
              padding: '0 8px',
              boxSizing: 'border-box',
              borderBottom: isActive ? '0' : '',
            }}
          >
            <FaFileAlt
              className={`mr-2 flex-shrink-0 ${
                isActive ? 'text-gray-800 dark:text-dark-text' : 'text-gray-500 dark:text-gray-500'
              }`}
            />
            <span
              className={`flex-1 overflow-hidden text-ellipsis ${
                isActive ? 'font-bold text-gray-800 dark:text-dark-text' : 'text-gray-600 dark:text-gray-500'
              } ${tab.confirmed ? '' : 'italic'}`}
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {tab.name}
            </span>
            <FaTimes
              className={`ml-2 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'text-gray-500 hover:text-gray-800 dark:text-dark-text'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
              }`}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록 합니다.
                handleTabClose(tab.id);
              }}
            />
          </div>
        );
      })}
      {openTabs.length === 0 && <div className='flex bg-white dark:bg-dark-background border-b h-10'></div>}
    </div>
  );
};

export default TabBar;
