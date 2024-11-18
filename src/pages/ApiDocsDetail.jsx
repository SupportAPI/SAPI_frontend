import { useParams } from 'react-router-dom';
import { useApiDocDetail, useWorkspaceCategoryList } from '../api/queries/useApiDocsQueries';
import { useFieldStates } from '../hooks/useFieldStates';
import { useState, useEffect } from 'react';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useTabStore } from '../stores/useTabStore';
import apiHandler from '../handlers/apiMessagehandler';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { useOccupationState } from '../api/queries/useWorkspaceQueries';
import LeftSection from './docs/LeftSection';
import RightSection from './docs/RightSection';
import useAuthStore from '../stores/useAuthStore';

const ApiDocsDetail = () => {
  const { workspaceId, apiId } = useParams();
  const {
    data: apiDocDetailData,
    isLoading: isApiDocDetailLoading,
    refetch: apiDocDetailRefetch,
  } = useApiDocDetail(workspaceId, apiId);
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
  const userId = useAuthStore((state) => state.userId);

  const [apiDocDetail, setApiDocDetail] = useFieldStates({});
  const [categoryList, setCategoryList] = useState([]);
  const [occupationState, setOccupationState] = useState([]);

  // useEffect(() => {
  //   if (location.pathname.includes('/apidocs')) setMenu('API Docs');
  // }, [setMenu]);

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
        addTab({
          id: apiId,
          name: apiDocDetailData.name,
          path: `/workspace/${workspaceId}/apidocs/${apiId}`,
          type: 'apidocs',
        });
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
        const handleSaveAction = () => {
          if (data.actionType === 'SAVE') {
            apiDocDetailRefetch();
            occupationStateRefetch();
          }
        };

        console.log(data);

        switch (data.apiType) {
          case 'CATEGORY':
            handleSaveAction();
            apiHandler.handleCategoryData(data, setApiDocDetail, categoryListRefetch);
            break;
          case 'OCCUPATION':
            handleSaveAction();
            occupationStateRefetch();
            break;
          case 'API_NAME':
            apiHandler.handleApiNameHandler(data, setApiDocDetail, userId);
            handleSaveAction();
            break;
          case 'API_METHOD':
            handleSaveAction();
            apiHandler.handleApiMethodHandler(data, setApiDocDetail);
            break;
          case 'API_PATH':
            apiHandler.handlePathHandler(data, setApiDocDetail, userId);
            handleSaveAction();
            break;
          case 'API_DESCRIPTION':
            apiHandler.handleDescriptionHandler(data, setApiDocDetail, userId);
            handleSaveAction();
            break;
          case 'PARAMETERS_AUTH_TYPE':
            handleSaveAction();
            apiHandler.handleAuthTypeHandler(data, setApiDocDetail);
            apiDocDetailRefetch();
            break;
          case 'PARAMETERS_HEADERS':
            apiHandler.handleHeadersHandler(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            handleSaveAction();
            break;
          case 'PARAMETERS_QUERY_PARAMETERS':
            handleSaveAction();
            apiHandler.handleQueryParameterData(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            break;
          case 'PARAMETERS_COOKIES':
            handleSaveAction();
            apiHandler.handleCookieData(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            break;
          case 'REQUEST_TYPE':
            handleSaveAction();
            apiHandler.handleRequestTypeData(data, setApiDocDetail);
            break;
          case 'REQUEST_JSON':
            handleSaveAction();
            apiHandler.handleRequestJsonData(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            break;
          case 'REQUEST_FORM_DATA':
            handleSaveAction();
            apiHandler.handleRequestFormData(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            break;
          case 'RESPONSE':
            apiHandler.handleResponse(data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch);
            break;
          default:
            console.warn(`Unhandled message type: ${data.apiType}`);
        }
      });

      return () => subscription.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, workspaceId, apiId, subscribe, apiDocDetail, categoryList]);

  const handleOccupationState = (apiType, actionType, data) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType,
      actionType,
      message: {
        ...data,
      },
    });
  };

  return (
    <div className='flex h-[calc(100vh -104px)]'>
      <LeftSection
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        categoryList={categoryList}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />

      <RightSection apiDocDetail={apiDocDetail} apiId={apiId} workspaceId={workspaceId} />
    </div>
  );
};

export default ApiDocsDetail;
