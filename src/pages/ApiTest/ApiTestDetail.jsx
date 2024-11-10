import { useState, useEffect } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
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

const ApiTestDetail = () => {
  const [apiData, setApiData] = useState([{ category: 'Uncategorized', name: 'New API' }]);
  const [apiDetail, setApiDetail] = useState(1);
  const [apimethod, setApimethod] = useState('POST');
  const [apiname, setApiname] = useState('API NAME');
  const [apiUrl, setApiUrl] = useState('/api/memberships/membershipid/role');
  const [activeTabContent, setActiveTabContent] = useState('Parameters'); // 기본 탭을 'Parameters'로 설정
  const [activeTabResult, setActiveTabResult] = useState('Body'); // 기본 탭을 'Parameters'로 설정

  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs, removeTab } = useTabStore();
  const { setMenu } = useNavbarStore();
  const { workspaceId, apiId } = useParams();
  const location = useLocation();

  const handleCopyAddress = () => {
    // Address 카피할 수 있는 기능 추가할 것
  };

  // Content Tap
  const renderTabContent = () => {
    switch (activeTabContent) {
      case 'Parameters':
        return <ApiTestParameters />;
      case 'Body':
        return <ApiTestBody />;

      default:
        return null;
    }
  };

  // Result Tap
  const renderTabResult = () => {
    switch (activeTabResult) {
      case 'Body':
        return <div>1</div>;
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
      setApiDetail(apiData);
      const category = apiData.category;
      if (category && !expandedCategories[category]) expandCategory(category);
      if (!openTabs.find((tab) => tab.id === apiId)) {
        addTab({ id: apiId, name: apiData.name, path: `/workspace/${workspaceId}/api-test/${apiId}` });
      }
    }
  }, [apiData, apiId, expandCategory, addTab, setMenu, expandedCategories, openTabs, location.pathname, workspaceId]);

  return (
    <div className='flex h-full'>
      <div className='flex-1 overflow-hidden'>
        <div className='flex flex-col min-w-[900px] h-screen border-white p-2 rounded-lg'>
          {/* 상단 제목 단 */}
          <div className='mb-4'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  {apimethod}
                </div>
                <div>
                  <div className='text-xl font-semibold'>{apiname}</div>
                  <div className='flex items-center'>
                    <div className='max-w-[350px] mr-2 truncate'>{apiUrl}</div>
                    <button onClick={handleCopyAddress}>
                      <IoCopyOutline />
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  <div className='flex items-center'>
                    <RiArrowDropDownLine className='text-xl' />
                    Local
                  </div>
                </button>
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
          <ResizableBox
            width={Infinity}
            height={500}
            resizeHandles={['se', 's', 'sw', 'ne', 'nw', 'n']}
            minConstraints={[Infinity, 100]}
            maxConstraints={[Infinity, 700]}
          >
            {/* 탭에 따른 내용 영역 */}
            <div className='p-4 overflow-y-auto border-b h-full sidebar-scrollbar'>{renderTabContent()}</div>
          </ResizableBox>

          {/* 테스트 결과 영역 */}
          <div className='flex-1 p-4 overflow-y-auto border-t-2 sidebar-scrollbar'>
            {/* 탭 네비게이션 */}
            <div className='flex mb-4'>
              <button
                className={`w-[60px] mr-3 mb-1  text-[13px] ${
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
            <div className='border p-4 overflow-y-auto border-b h-full sidebar-scrollbar text-[13px]'>
              {renderTabResult()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestDetail;
