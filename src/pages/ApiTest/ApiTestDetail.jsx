import { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { ResizableBox } from 'react-resizable';
import { FaSave } from 'react-icons/fa';
import 'react-resizable/css/styles.css';
import ApiTestParameters from './ApiTestParameters';
import ApiTestBody from './APitestBody';
import { useNavbarStore } from '../../stores/useNavbarStore';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';
import { useTabStore } from '../../stores/useTabStore';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useFetchApiDetail, patchApiDetail, requestApiTest } from '../../api/queries/useApiTestQueries';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';

const ApiTestDetail = () => {
  const { workspaceId, apiId } = useParams();
  const { data: apiInfo, isLoading, refetch } = useFetchApiDetail(workspaceId, apiId);
  const [apiDetail, setApiDetail] = useState(null);
  const [apiData, setApiData] = useState([{ category: 'Uncategorized', name: 'New API' }]);
  const [apimethod, setApimethod] = useState('null');
  const [apiname, setApiname] = useState('null');
  const [apiUrl, setApiUrl] = useState('null');
  const [testResult, setTestResult] = useState(null);
  const [activeTabContent, setActiveTabContent] = useState(null); // 기본 탭을 'Parameters'로 설정
  const [activeTabResult, setActiveTabResult] = useState('Body'); // 기본 탭을 'Parameters'로 설정
  const [copySuccess, setCopySuccess] = useState(false); // 복사 성공 여부 상태 추가
  const { environment } = useEnvironmentStore();

  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs, removeTab } = useTabStore();
  const { setMenu } = useNavbarStore();

  const [renderApi, setRenderApi] = useState(false);
  const [renderInfo, setRenderInfo] = useState(false);

  const location = useLocation();

  const editApiTestDetailsMutation = useMutation((api) => patchApiDetail(workspaceId, apiId, api), {
    onSuccess: (response) => {
      console.log('저장 성공!');
      refetch();
    },
    onError: (error) => console.error('저장 실패!', error),
  });

  const requestApiTestMutation = useMutation((apiTestInfo) => requestApiTest(workspaceId, apiTestInfo), {
    onSuccess: (response) => {
      setTestResult(response);
      console.log('테스트 완료', response);
    },
    onError: (error) => console.error('실패!', error),
  });

  useEffect(() => {
    // 페이지 이동이나 location 변경 시 refetch로 데이터 다시 로딩
    if (apiId) {
      setActiveTabContent(null);
      setRenderApi(false);
      refetch();
    }
  }, [apiId, workspaceId, location.pathname, refetch]); // apiId 또는 경로가 변경될 때마다 refetch 호출

  useEffect(() => {
    if (apiInfo && (!apiDetail || JSON.stringify(apiDetail) !== JSON.stringify(apiInfo))) {
      setApiDetail({
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
                isEssential: header.isEssential || false,
                isChecked: header.isChecked || false,
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
                isEssential: queryParam.isEssential || false,
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
                isEssential: cookie.isEssential || false,
                isChecked: cookie.isChecked || false,
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
                isEssential: formItem.isEssential || false,
                isChecked: formItem.isChecked || false,
              }))
            : [
                {
                  id: '',
                  key: '',
                  value: '',
                  type: 'TEXT',
                  description: '',
                  isEssential: false,
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
      console.log('들어옴?');
      console.log(apiDetail);
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

  // console.log('apiInfo', apiInfo);
  // console.log('apiDetail', apiDetail);

  // Content Tap
  const renderTabContent = () => {
    switch (activeTabContent) {
      case 'Parameters':
        return <ApiTestParameters initialValues={apiDetail?.parameters || []} paramsChange={handleParamsChange} />;
      case 'Body':
        return <ApiTestBody body={apiDetail?.request || []} bodyChange={handleBodyChange} />;
      default:
        return null;
    }
  };

  // Result Tap
  const renderTabResult = () => {
    switch (activeTabResult) {
      case 'Body':
        return (
          <div>
            <div>11</div>
          </div>
        );
      case 'Cookies':
        return <div>2</div>;
      case 'Headers':
        return <div>3</div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (apiData && apiId) {
      const category = apiData.category;
      if (category && !expandedCategories[category]) expandCategory(category);
      if (!openTabs.find((tab) => tab.id === apiId)) {
        addTab({ id: apiId, name: apiData.name, path: `/workspace/${workspaceId}/api-test/${apiId}` });
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
      parameters: {
        headers: (apiDetail.parameters.headers || []).map((header) => ({
          headerId: header.id || null,
          headerValue: header.value || null,
          isChecked: header.isChecked || true,
        })),
        pathVariables: (apiDetail.parameters.pathVariables || []).map((pathVariable) => ({
          pathVariableId: pathVariable.id || null,
          pathVariableValue: pathVariable.value || null,
        })),
        queryParameters: (apiDetail.parameters.queryParameters || []).map((queryParameter) => ({
          queryParameterId: queryParameter.id || null,
          queryParameterValue: queryParameter.value || null,
          isChecked: queryParameter.isChecked || true,
        })),
        cookies: (apiDetail.parameters.cookies || []).map((cookie) => ({
          cookieId: cookie.id || null,
          cookieValue: cookie.value || null,
          isChecked: cookie.isChecked || true,
        })),
      },
      request: {
        json: apiDetail.request.json
          ? {
              jsonDataId: apiDetail.request.json.id || null,
              jsonDataValue: apiDetail.request.json.value || null,
            }
          : null,
        formData: (apiDetail.request.formData || []).map((formData) => ({
          formDataId: formData.id || null,
          formDataValue: formData.value || null,
          isChecked: formData.isChecked || false,
        })),
      },
    };
  };

  const handleEditApi = () => {
    const transformedData = transformApiDetail(apiDetail);
    editApiTestDetailsMutation.mutate(transformedData);
  };

  const handleApiTest = () => {
    if (apiDetail) {
      const transformData = {
        parameters: apiDetail.parameters,
        request: apiDetail.request,
      };

      // 환경 변수로 대체하는 함수
      const parseTemplateStrings = (data) => {
        console.log(data);
        // 주어진 데이터가 객체일 때 재귀적으로 파싱
        if (typeof data === 'object' && data !== null) {
          for (const key in data) {
            console.log('ddd1', key);
            data[key] = parseTemplateStrings(data[key]);
            console.log('ddd2', data[key]);
          }
          return data;
        }

        console.log(environment);
        // 주어진 데이터가 문자열일 때 템플릿 형식(`{{variable}}`)을 찾아 대체
        if (typeof data === 'string') {
          console.log('들어왔어요');
          return data.replace(/{{(.*?)}}/g, (match, variable) => {
            const envVar = environment.find((env) => env.variable === variable);
            console.log(envVar);
            return envVar ? envVar.value : match; // 변수 값이 없으면 원본 유지
          });
        }

        return data; // 다른 타입은 그대로 반환
      };

      // transformData를 환경 변수로 파싱한 후 requestApiTestMutation 호출
      const parsedData = parseTemplateStrings(transformData);
      console.log('Parsed Data:', parsedData);
      requestApiTestMutation.mutate(parsedData);
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
              <div className='flex'>
                {/* <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  <div className='flex items-center'>
                    <RiArrowDropDownLine className='text-xl' />
                    Local
                  </div>
                </button> */}
                <button
                  className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'
                  onClick={handleApiTest}
                >
                  TEST
                </button>
                <button
                  className='flex justify-center items-center w-[50px] border p-3 rounded-lg bg-[#2D3648] text-white'
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
            <ResizableBox
              width={Infinity}
              height={400}
              resizeHandles={['se', 's', 'sw', 'ne', 'nw', 'n']}
              minConstraints={[Infinity, 100]}
              maxConstraints={[Infinity, 700]}
            >
              {/* 탭에 따른 내용 영역 */}
              <div className='p-4 overflow-y-auto border-b h-full sidebar-scrollbar'>
                {activeTabContent && renderTabContent()}
              </div>
            </ResizableBox>

            {/* 테스트 결과 영역 */}
            <div className='p-4 overflow-y-auto border-t-2 sidebar-scrollbar h-[400px]'>
              {/* 탭 네비게이션 */}
              <div key={activeTabResult} className='mb-2 border-b'>
                Response
              </div>
              <div className='flex mb-4'>
                <button
                  className={`w-[60px] mr-3 mb-1 text-[13px] ${
                    activeTabResult === 'Body' ? 'border-b-2 border-blue-500' : ''
                  }`}
                  onClick={() => setActiveTabResult('Body')}
                >
                  Body
                </button>
                <button
                  className={`w-[60px] mr-3 mb-1 text-[13px] ${
                    activeTabResult === 'Cookies' ? 'border-b-2 border-blue-500' : ''
                  }`}
                  onClick={() => setActiveTabResult('Cookies')}
                >
                  Cookies
                </button>
                <button
                  className={`w-[60px] mr-3 mb-1 text-[13px] ${
                    activeTabResult === 'Headers' ? 'border-b-2 border-blue-500' : ''
                  }`}
                  onClick={() => setActiveTabResult('Headers')}
                >
                  Headers
                </button>
              </div>
              <div className='border p-4 overflow-y-auto border-b sidebar-scrollbar text-[13px]'>
                {renderTabResult()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestDetail;
