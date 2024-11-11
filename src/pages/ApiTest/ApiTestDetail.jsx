import { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { ResizableBox } from 'react-resizable';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { FaSave } from 'react-icons/fa';
import 'react-resizable/css/styles.css';
import ApiTestParameters from './ApiTestParameters';
import ApiTestBody from './APitestBody';
import { useNavbarStore } from '../../stores/useNavbarStore';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useTabStore } from '../../stores/useTabStore';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useFetchApiDetail } from '../../api/queries/useApiTestQueries';
import { toast } from 'react-toastify';

const ApiTestDetail = () => {
  const { workspaceId, apiId } = useParams();
  const { data: apiInfo, isLoading, refetch } = useFetchApiDetail(workspaceId, apiId);
  const [apiDetail, setApiDetail] = useState(null);
  const [apiData, setApiData] = useState([{ category: 'Uncategorized', name: 'New API' }]);
  const [apimethod, setApimethod] = useState('null');
  const [apiname, setApiname] = useState('null');
  const [apiUrl, setApiUrl] = useState('null');
  const [activeTabContent, setActiveTabContent] = useState(null); // 기본 탭을 'Parameters'로 설정
  const [activeTabResult, setActiveTabResult] = useState('Body'); // 기본 탭을 'Parameters'로 설정
  const [copySuccess, setCopySuccess] = useState(false); // 복사 성공 여부 상태 추가

  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs, removeTab } = useTabStore();
  const { setMenu } = useNavbarStore();

  const [renderApi, setRenderApi] = useState(false);

  const location = useLocation();

  console.log('apidetail', apiDetail);

  useEffect(() => {
    // 페이지 이동이나 location 변경 시 refetch로 데이터 다시 로딩
    if (apiId) {
      setActiveTabContent(null);
      setRenderApi(false);
      refetch();
    }
  }, [apiId, location.pathname, refetch]); // apiId 또는 경로가 변경될 때마다 refetch 호출

  useEffect(() => {
    if (apiInfo) {
      setApiDetail(apiInfo);
      setApiData({ category: 'Uncategorized', name: `${apiInfo.name}` });
      setApiname(apiInfo.name);
      setApiUrl(apiInfo.path || 'Url이 존재하지 않습니다.');
      setApimethod(apiInfo.method);
    }
  }, [apiInfo]); // apiInfo만 의존성으로 추가

  useEffect(() => {
    if (!renderApi) {
      console.log('들어옴?');
      setActiveTabContent('Parameters');
      setRenderApi(true);
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
                <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  TEST
                </button>
                <button className='flex justify-center items-center w-[50px] border p-3 rounded-lg bg-[#2D3648] text-white'>
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
              <div className='mb-2 border-b'>Response</div>
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
