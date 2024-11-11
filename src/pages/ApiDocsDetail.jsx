import { useParams } from 'react-router-dom';
import { useApiDocDetail, useWorkspaceCategoryList } from '../api/queries/useApiDocsQueries';
import { useFieldStates } from '../hooks/useFieldStates';
import { useState, useEffect } from 'react';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useTabStore } from '../stores/useTabStore';
import apiHandler from '../handlers/apiMessagehandler';

import { useWebSocket } from '../contexts/WebSocketContext';
import { useOccupationState } from '../api/queries/useWorkspaceQueries';
import LeftSection from './docs/LeftSection';
import RightSection from './docs/RightSection';

const ApiDocsDetail = () => {
  const { workspaceId, apiId } = useParams();
  const { data: apiDocDetailData, isLoading: isApiDocDetailLoading } = useApiDocDetail(workspaceId, apiId);
  const {
    data: categoryListData,
    isLoading: isCategoryListLoading,
    refetch: categoryListRefetch,
  } = useWorkspaceCategoryList(workspaceId);
  const {
    data: occupationStateData,
    isLoading: isOccupationStateLoading,
    refetch: occupationStateRefetch,
  } = useOccupationState(workspaceId);

  const { setMenu } = useNavbarStore();
  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs } = useTabStore();
  const { subscribe, publish, isConnected } = useWebSocket();

  const [apiDocDetail, setApiDocDetail] = useFieldStates({});
  const [categoryList, setCategoryList] = useState([]);
  const [occupationState, setOccupationState] = useState([]);

  useEffect(() => {
    if (location.pathname.includes('/apidocs')) setMenu('API Docs');
  }, [setMenu]);

  useEffect(() => {
    if (
      !isApiDocDetailLoading &&
      !isCategoryListLoading &&
      !isOccupationStateLoading &&
      apiDocDetailData &&
      categoryListData &&
      occupationStateData
    ) {
      setApiDocDetail([], apiDocDetailData);
      setCategoryList(categoryListData);
      setOccupationState(occupationStateData);

      if (!openTabs.find((tab) => tab.id === apiId)) {
        addTab({ id: apiId, name: apiDocDetailData.name, path: `/workspace/${workspaceId}/apidocs/${apiId}` });
      }

      if (apiDocDetailData.category && !expandedCategories[apiDocDetailData.category])
        expandCategory(apiDocDetailData.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiDocDetailData,
    categoryListData,
    occupationStateData,
    apiId,
    isApiDocDetailLoading,
    isCategoryListLoading,
    isOccupationStateLoading,
  ]);

  useEffect(() => {
    if (isConnected) {
      const subscriptionPath = `/ws/sub/workspaces/${workspaceId}/apis/${apiId}`;
      const subscription = subscribe(subscriptionPath, (data) => {
        console.log(data);
        switch (data.apiType) {
          case 'PARAMETERS_QUERY_PARAMETERS':
            apiHandler.handleQueryParameterData(data, setApiDocDetail);
            break;
          case 'CATEGORY':
            apiHandler.handleCategoryData(data, setApiDocDetail);
            categoryListRefetch();
            console.log(apiDocDetail);
            break;
          case 'OCCUPATION':
            occupationStateRefetch();
            console.log(occupationState);
            break;
          case 'API_NAME':
            apiHandler.handleApiNameHandler(data, setApiDocDetail);
            console.log(apiDocDetail);
            break;
          case 'API_PATH':
            break;
          default:
            console.warn(`Unhandled message type: ${data.apiType}`);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isConnected, workspaceId, apiId, subscribe, apiDocDetail, categoryList]);

  const handleOccupationState = (componentId, actionType) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'OCCUPATION',
      actionType,
      message: {
        id: componentId,
      },
    });
  };

  return (
    <div className='flex h-[calc(100vh -104px)]'>
      {/* 왼쪽 섹션 헤더 */}
      <LeftSection
        apiDocDetail={apiDocDetail}
        categoryList={categoryList}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />

      {/* 오른쪽 섹션 */}
      <RightSection />
    </div>
  );
};

export default ApiDocsDetail;
