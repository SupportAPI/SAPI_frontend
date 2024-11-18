import { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import 'react-resizable/css/styles.css';
import ApiTestParameters from './ApiTestParameters';
import ApiTestRequestBody from './ApiTestRequestBody';
import ApiTestResponseBody from './ApiTestResponseBody';
import { useNavbarStore } from '../../stores/useNavbarStore';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useTabStore } from '../../stores/useTabStore';
import { useTestStore } from '../../stores/useTestStore';
import { useParams, useLocation } from 'react-router-dom';
import {
  useFetchApiDetail,
  patchApiDetail,
  useRequestRealServer,
  useValidateDocs,
  validateDocs,
} from '../../api/queries/useApiTestQueries';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

const ApiTestDetail = () => {
  const { workspaceId, apiId } = useParams();
  const { data: apiInfo, isLoading, refetch } = useFetchApiDetail(workspaceId, apiId);
  const [apiDetail, setApiDetail] = useState(null);
  const [apiData, setApiData] = useState([{ category: 'Uncategorized', name: 'New API' }]);
  const [apimethod, setApimethod] = useState('null');
  const [apiname, setApiname] = useState('null');
  const [apiUrl, setApiUrl] = useState('null');
  const [testResult, setTestResult] = useState(null);
  const [activeTabContent, setActiveTabContent] = useState(null);
  const [activeTabResult, setActiveTabResult] = useState('Body');
  const [copySuccess, setCopySuccess] = useState(false);
  const [urlType, setUrlType] = useState('Server');
  const [showUrlDropdown, setShowUrlDropdown] = useState(false);

  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs } = useTabStore();
  const { setMenu } = useNavbarStore();
  const { testUrl, setTestUrl } = useTestStore();

  const [renderApi, setRenderApi] = useState(false);
  const [renderInfo, setRenderInfo] = useState(false);

  const location = useLocation();

  const { mutateAsync: requestApiTest } = useRequestRealServer();
  const mutation = useValidateDocs();

  const editApiTestDetailsMutation = useMutation((api) => patchApiDetail(workspaceId, apiId, api), {
    onSuccess: (response) => {
      refetch();
    },
    onError: (error) => console.error('저장 실패!', error),
  });

  useEffect(() => {
    // 페이지 이동이나 location 변경 시 refetch로 데이터 다시 로딩
    if (apiId) {
      setActiveTabContent(null);
      setRenderApi(false);
      refetch();
    }
  }, [apiId, workspaceId, location.pathname, refetch]); // apiId 또는 경로가 변경될 때마다 refetch 호출

  const handleUrlSelect = (selectedUrl) => {
    setUrlType(selectedUrl);
    setShowUrlDropdown(false);
  };

  const handleInputChange = (e) => {
    setTestUrl(e.target.value);
  };

  useEffect(() => {
    if (apiInfo && (!apiDetail || JSON.stringify(apiDetail) !== JSON.stringify(apiInfo))) {
      setApiDetail({
        domain: apiInfo.domain || '',
        docId: apiInfo.docId || '',
        apiId: apiInfo.apiId || '',
        name: apiInfo.name || 'New API',
        method: apiInfo.method || 'GET',
        path: apiInfo.path || '',
        category: apiInfo.category || 'Uncategorized',
        localStatus: apiInfo.localStatus || 'PENDING',
        serverStatus: apiInfo.serverStatus || 'PENDING',
        managerEmail: apiInfo.managerEmail || '',
        managerName: apiInfo.managerName || '',
        managerProfileImage: apiInfo.managerProfileImage || '',
        parameters: {
          authType: apiInfo.parameters?.authType || 'NOAUTH',
          headers: apiInfo.parameters?.headers
            ? apiInfo.parameters.headers.map((header) => ({
                id: header.id || '',
                key: header.key || '',
                value: header.value || '',
                description: header.description || '',
                isRequired: header.isRequired || false,
                isChecked: header.isChecked || false,
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  description: '',
                  isRequired: false,
                  isChecked: false,
                },
              ],
          pathVariables: apiInfo.parameters?.pathVariables
            ? apiInfo.parameters.pathVariables.map((variable) => ({
                id: variable.id || '',
                key: variable.key || '',
                value: variable.value || '',
                description: variable.description || '',
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  description: '',
                },
              ],
          queryParameters: apiInfo.parameters?.queryParameters
            ? apiInfo.parameters.queryParameters.map((queryParam) => ({
                id: queryParam.id || '',
                key: queryParam.key || '',
                value: queryParam.value || '',
                description: queryParam.description || '',
                isRequired: queryParam.isRequired || false,
                isChecked: queryParam.isChecked || false,
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  description: '',
                  isEssential: false,
                  isChecked: false,
                },
              ],
          cookies: apiInfo.parameters?.cookies
            ? apiInfo.parameters.cookies.map((cookie) => ({
                id: cookie.id || '',
                key: cookie.key || '',
                value: cookie.value || '',
                description: cookie.description || '',
                isRequired: cookie.isRequired || false,
                isChecked: cookie.isChecked || false,
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  description: '',
                  isRequired: false,
                  isChecked: false,
                },
              ],
        },
        request: {
          bodyType: apiInfo.request?.bodyType || 'NONE',
          json: apiInfo.request?.json
            ? {
                id: apiInfo.request.json.id || '',
                value: apiInfo.request.json.value || '',
              }
            : { id: '', value: '' },
          formData: apiInfo.request?.formData
            ? apiInfo.request.formData.map((formItem) => ({
                id: formItem.id || '',
                key: formItem.key || '',
                value: formItem.value || '',
                type: formItem.type || 'TEXT',
                description: formItem.description || '',
                isRequired: formItem.isRequired || false,
                isChecked: formItem.isChecked || false,
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  type: 'TEXT',
                  description: '',
                  isRequired: false,
                  isChecked: false,
                },
              ],
        },
      });

      setApiData({ category: 'Uncategorized', name: `${apiInfo.name}` });
      setApiname(apiInfo.name);
      setApiUrl(apiInfo.path || 'Url이 존재하지 않습니다.');
      setApimethod(apiInfo.method);
      setRenderInfo(true);
    }
  }, [apiInfo]);

  useEffect(() => {
    if (!renderApi && renderInfo) {
      setActiveTabContent('Parameters');
      setRenderApi(true);
      setRenderInfo(false);
    }
  }, [apiDetail]);

  // Url 복사 기능
  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(apiUrl)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 300); // 2초 후에 알림 숨기기
        toast('클립보드에 복사되었습니다.');
      })
      .catch((error) => console.error('URL 복사에 실패했습니다:', error));
  };

  const handleParamsChange = (newParams) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      parameters: newParams,
    }));
  };

  const handleBodyChange = (newBodies) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      request: newBodies,
    }));
  };

  // Content Tap
  const renderTabContent = () => {
    switch (activeTabContent) {
      case 'Parameters':
        return <ApiTestParameters initialValues={apiDetail?.parameters || []} paramsChange={handleParamsChange} />;
      case 'Body':
        return <ApiTestRequestBody body={apiDetail?.request || []} bodyChange={handleBodyChange} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (apiData && apiId) {
      const category = apiData.category;
      if (category && !expandedCategories[category]) expandCategory(category);
      if (!openTabs.find((tab) => tab.id === apiId)) {
        addTab({
          id: apiId,
          name: apiData.name,
          path: `/workspace/${workspaceId}/api-test/${apiId}`,
          type: 'api-test',
        });
      }
    }
  }, [apiData, apiId, expandCategory, addTab, setMenu, expandedCategories, openTabs, location.pathname, workspaceId]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (!apiInfo) {
    return <div>Error: API data not found.</div>; // apiInfo가 없을 때 표시할 오류 메시지
  }

  const transformApiDetail = (apiDetail) => {
    return {
      docId: apiDetail.docId,
      apiId: apiDetail.apiId,
      method: apiDetail.method,
      path: apiDetail.path,
      parameters: {
        headers: (apiDetail.parameters.headers || []).map((header) => ({
          id: header.id || null,
          value: header.value || null,
          isChecked: header.isChecked || true,
        })),
        pathVariables: (apiDetail.parameters.pathVariables || []).map((pathVariable) => ({
          id: pathVariable.id || null,
          value: pathVariable.value || null,
        })),
        queryParameters: (apiDetail.parameters.queryParameters || []).map((queryParameter) => ({
          id: queryParameter.id || null,
          value: queryParameter.value || null,
          isChecked: queryParameter.isChecked || true,
        })),
        cookies: (apiDetail.parameters.cookies || []).map((cookie) => ({
          id: cookie.id || null,
          value: cookie.value || null,
          isChecked: cookie.isChecked || true,
        })),
      },
      request: {
        json: apiDetail.request.json
          ? {
              id: apiDetail.request.json.id || null,
              value: apiDetail.request.json.value || null,
            }
          : null,
        formData: (apiDetail.request.formData || []).map((formData) => ({
          id: formData.id || null,
          value: formData.value || null,
          isChecked: formData.isChecked || false,
        })),
      },
    };
  };

  const handleEditApi = () => {
    const transformedData = transformApiDetail(apiDetail);
    editApiTestDetailsMutation.mutate(transformedData);
  };

  const handleApiTest = async () => {
    if (apiInfo) {
      try {
        console.log(apiInfo);
        const response = await requestApiTest({ apiInfo: apiInfo, apiBaseUrl: apiInfo.domain });
        const stringifiedData = JSON.stringify(response.data);
        if (response) {
          const responseData = await validateDocs({
            workspaceId: workspaceId,
            docId: apiInfo.docId,
            payload: {
              data: stringifiedData,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              config: response.config,
              request: response.request,
            },
            type: 'Local',
          });

          setTestResult(responseData.data);
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    }
  };

  return (
    <div className='flex p-4'>
      <div className='flex-1'>
        <div className='flex flex-col border-white p-2 h-full w-full'>
          {/* 상단 제목 단 */}
          <div className='mb-2'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  {apimethod}
                </div>
                <div>
                  <div className='text-xl font-semibold'>{apiname}</div>
                  <div className='flex items-center'>
                    <div className='max-w-[350px] mr-2 truncate'>{apiUrl}</div>
                    <button onClick={handleCopyAddress}>{copySuccess ? <IoCopy /> : <IoCopyOutline />}</button>
                  </div>
                </div>
              </div>
              <div className='flex mr-2'>
                <div className='relative'>
                  <div className='w-[450px] flex flex-row '>
                    <button
                      className={`w-[160px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center hover:bg-[#4B5569]`}
                      onClick={() => {
                        setShowUrlDropdown((prev) => !prev);
                      }}
                    >
                      <div className='flex justify-between items-center pr-1 pl-4'>
                        <span>{urlType}</span>
                        {showUrlDropdown ? (
                          <RiArrowDropDownLine className='text-2xl' />
                        ) : (
                          <RiArrowDropUpLine className='text-2xl' />
                        )}
                      </div>
                    </button>
                    <input
                      type='text'
                      value={urlType === 'Server' ? '' : testUrl}
                      disabled={urlType === 'Server'}
                      onChange={(e) => handleInputChange(e)}
                      placeholder={urlType === 'Server' ? '서버 URL 입력 불가' : '로컬 호스트 URL을 입력하세요'}
                      className={`w-full text-sm border p-1 text-center rounded-lg ${
                        urlType === 'Server' ? 'bg-[#F0F5F8] cursor-not-allowed' : 'bg-white'
                      }`}
                    />
                  </div>
                  {showUrlDropdown && (
                    <div
                      className='absolute bg-white border-2 mt-1 rounded shadow-md z-10 text-center'
                      style={{ top: '100%', left: 0, width: '115px' }}
                    >
                      {['Server', 'Local'].map((url) => (
                        <div
                          key={url}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-200`}
                          onClick={() => handleUrlSelect(url)}
                        >
                          {url}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  <div className='flex items-center'>
                    <RiArrowDropDownLine className='text-xl' />
                    Local
                  </div>
                </button> */}
                <button
                  className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white ml-4 mr-4 text-center hover:bg-[#4B5569]'
                  onClick={handleApiTest}
                >
                  TEST
                </button>
                <button
                  className='flex justify-center items-center w-[50px] border p-3 rounded-lg bg-[#2D3648] text-white  hover:bg-[#4B5569]'
                  onClick={handleEditApi}
                >
                  <FaSave />
                </button>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className='flex mb-4 border-b-2 border-gray-200'>
            <button
              className={`w-[200px] p-2 ${activeTabContent === 'Parameters' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTabContent('Parameters')}
            >
              Parameters
            </button>
            <button
              className={`w-[200px] p-2 ${activeTabContent === 'Body' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTabContent('Body')}
            >
              Body
            </button>
          </div>

          {/* 화면 분할 */}
          <div>
            <div className='h-[400px]'>
              {/* 탭에 따른 내용 영역 */}
              <div className='p-4 overflow-y-auto border-b h-full sidebar-scrollbar border'>
                {activeTabContent && renderTabContent()}
              </div>
            </div>

            <div key={activeTabResult} className='mt-5 mb-2'>
              Response
            </div>
            {testResult ? (
              <ApiTestResponseBody initialData={testResult} />
            ) : (
              <div className='flex justify-center items-center h-[200px] text-m'>Could not send request</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestDetail;
