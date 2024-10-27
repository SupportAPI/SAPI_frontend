import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApiDocs } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useTabStore } from '../stores/useTabStore';

const ApiDocsDetail = () => {
  const { workspaceId, apiId } = useParams();
  const location = useLocation();
  const { data: apiData, isLoading, error } = useApiDocs();
  const { setMenu } = useNavbarStore();
  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs } = useTabStore();

  useEffect(() => {
    // 현재 위치에 따라 메뉴 설정
    if (location.pathname.includes('/apidocs')) {
      setMenu('API Docs');
    } else if (location.pathname.includes('/apitest')) {
      setMenu('API Test');
    } else if (location.pathname.includes('/dashboard')) {
      setMenu('Dashboard');
    }

    // API 데이터가 로드되고, 특정 API ID가 있는 경우 초기 상태 설정
    if (apiData && apiId) {
      // 해당 API가 속한 카테고리를 찾기
      const category = apiData.find((cat) => cat.apis.some((api) => api.id === apiId));

      if (category) {
        // 1. Sidebar에서 해당 카테고리를 강제로 열기
        if (!expandedCategories[category.category]) {
          expandCategory(category.category);
        }

        // 2. TabBar에 해당 API 추가 (이미 추가되지 않은 경우만)
        const existingTab = openTabs.find((tab) => tab.id === apiId);
        if (!existingTab) {
          const apiDetail = category.apis.find((api) => api.id === apiId);
          addTab({
            id: apiId,
            name: apiDetail.name,
            path: `/workspace/${workspaceId}/apidocs/${apiId}`,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData, apiId]);

  if (isLoading) {
    return <div className='p-4'>Loading API details...</div>;
  }

  if (error) {
    return <div className='p-4'>Failed to load API data. Please try again later.</div>;
  }

  if (!apiData) {
    return <div className='p-4'>No API data available.</div>;
  }

  const apiDetail = apiData.flatMap((category) => category.apis).find((api) => api.id === apiId);

  if (!apiDetail) {
    return <div className='p-4'>API not found.</div>;
  }

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold'>{apiDetail.name}</h2>
      <p>Category: {apiDetail.category}</p>
      <p>Method: {apiDetail.method || 'GET'}</p>
      <p>Path: {apiDetail.path || `/api/${apiDetail.name.toLowerCase().replace(/\s+/g, '-')}`}</p>
      <p>Description: {apiDetail.description || 'No description available'}</p>
    </div>
  );
};

export default ApiDocsDetail;
