import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApiDocDetail, useWorkspaceCategory } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useTabStore } from '../stores/useTabStore';
import { FiChevronDown, FiMessageSquare, FiCode, FiFileText, FiX } from 'react-icons/fi';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt } from 'react-icons/fa';
import { useWebSocket } from '../contexts/WebSocketContext';

import Parameters from './docs/Parameters';
import Request from './docs/Request';
import Response from './docs/Response';
import Comments from './docs/Comments';
import Summary from './docs/Summary';
import CodeSnippet from './docs/CodeSnippet';

const ApiDocsDetail = () => {
  const { workspaceId, apiId } = useParams();
  const location = useLocation();
  const { data: apiData, isLoading, error } = useApiDocDetail();
  const { data: categoryData } = useWorkspaceCategory();
  const [apiDetail, setApiDetail] = useState(null);
  const { setMenu } = useNavbarStore();
  const { expandedCategories, expandCategory } = useSidebarStore();
  const { addTab, openTabs, removeTab } = useTabStore();
  const { publish } = useWebSocket();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');
  const [activeRightTab, setActiveRightTab] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const nameRef = useRef(null);

  const methodStyles = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-orange-500',
    PATCH: 'text-purple-500',
    DELETE: 'text-red-500',
    HEAD: 'text-gray-500',
    OPTIONS: 'text-yellow-500',
  };

  const adjustWidth = (target, ref) => {
    ref.current.style.width = '0px';
    ref.current.style.width = `${target.scrollWidth}px`;
  };

  const handleCategoryChange = (e) => {
    setApiDetail((prev) => ({ ...prev, category: e.target.value }));
    adjustWidth(e.target, categoryRef);
  };

  const handleNameChange = (e) => {
    setApiDetail((prev) => ({ ...prev, name: e.target.value }));
    adjustWidth(e.target, nameRef);
  };

  useEffect(() => {
    if (location.pathname.includes('/apidocs')) setMenu('API Docs');
    if (apiData && apiId) {
      setApiDetail(apiData);
      const category = apiData.category;
      if (category && !expandedCategories[category]) expandCategory(category);
      if (!openTabs.find((tab) => tab.id === apiId)) {
        addTab({ id: apiId, name: apiData.name, path: `/workspace/${workspaceId}/apidocs/${apiId}` });
      }
    }
  }, [apiData, apiId, expandCategory, addTab, setMenu, expandedCategories, openTabs, location.pathname, workspaceId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (categoryRef.current) adjustWidth(categoryRef.current, categoryRef);
    if (nameRef.current) adjustWidth(nameRef.current, nameRef);
  }, [apiDetail]);

  if (isLoading) return <div className='p-4'>Loading API details...</div>;
  if (error) return <div className='p-4'>Failed to load API data. Please try again later.</div>;

  const handleMethodSelect = (selectedMethod) => {
    setApiDetail((prev) => ({ ...prev, method: selectedMethod }));
    setShowDropdown(false);
  };

  const handleDescriptionChange = (e) => {
    setApiDetail((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleApiUrlChange = (e) => {
    setApiDetail((prev) => ({ ...prev, path: e.target.value }));
  };

  const toggleRightTab = (tab) => {
    setActiveRightTab(activeRightTab === tab ? null : tab);
  };

  const handleParamsChange = (newParams) => {};

  const handleRequestChange = (newRequest) => {};

  const handleResponseChange = (updatedResponse) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      response: updatedResponse,
    }));
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (apiId) {
      publish(`/ws/pub/workspaces/${workspaceId}/docs`, {
        type: 'DELETE',
        message: apiId,
      });
    }
    const tabIndex = openTabs.findIndex((tab) => tab.id === apiId);
    removeTab(apiId);

    if (tabIndex > 0) {
      const previousTab = openTabs[tabIndex - 1];
      navigate(previousTab.path);
    } else if (tabIndex === 0 && openTabs.length > 1) {
      const nextTab = openTabs[1];
      navigate(nextTab.path);
    } else if (openTabs.length === 1) {
      navigate(`/workspace/${workspaceId}`);
    }
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className='flex h-[calc(100vh -104px)]'>
      <div className='flex-1 p-8 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable'>
        <div className='flex items-baseline space-x-2 mb-8 justify-between'>
          <div className='inline-flex items-baseline space-x-1'>
            <input
              type='text'
              ref={categoryRef}
              className='border-b focus:outline-none w-auto max-w-[200px] text-[18px] px-2'
              placeholder='Enter Category'
              value={apiDetail?.category || ''}
              onChange={handleCategoryChange}
            />
            <span className='text-gray-400' style={{ margin: '0 12px' }}>
              /
            </span>

            <input
              type='text'
              ref={nameRef}
              className='text-2xl border-b focus:outline-none w-auto max-w-[250px] px-2 text-[18px]'
              value={apiDetail?.name || ''}
              onChange={handleNameChange}
              placeholder='Enter API Name'
            />
          </div>

          <div className='flex space-x-4'>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaSave />
              <span>Save</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            >
              <FaTrashAlt />
              <span>Delete</span>
            </button>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaDownload />
              <span>Export</span>
            </button>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* 삭제 모달 */}
        {showDeleteModal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-bold mb-4'>삭제하시겠습니까?</h3>
              <p className='mb-6'>현재 API 문서를 삭제하시겠습니까?</p>
              <div className='flex justify-end space-x-4'>
                <button onClick={handleCloseModal} className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>
                  취소
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Path and Description */}
        <div className='mb-4'>
          <label className='block text-[18px] font-semibold mb-2'>API Path</label>
          <div className='relative'>
            <div className='flex items-center space-x-2'>
              <button
                className={`px-4 py-2 w-[150px] rounded-md border ${
                  methodStyles[apiDetail?.method]
                } border-gray-300 h-10`}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <div className='flex justify-between items-center'>
                  <span>{apiDetail?.method}</span>
                  <FiChevronDown className='ml-2' color='black' />
                </div>
              </button>

              <input
                type='text'
                className='border rounded px-2 py-1 flex-grow h-10'
                placeholder='Enter URL'
                value={apiDetail?.path || ''}
                onChange={handleApiUrlChange}
              />
            </div>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className='absolute bg-white border mt-1 rounded shadow-md z-10'
                style={{ top: '100%', left: 0, width: '150px' }}
              >
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => (
                  <div
                    key={method}
                    className={`p-2 cursor-pointer ${methodStyles[method]} hover:bg-gray-100`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    {method}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <label className='block font-semibold mb-2 text-[18px]'>Description</label>
          <textarea
            className='border rounded w-full p-2'
            placeholder='Enter description here.'
            value={apiDetail?.description || ''}
            onChange={handleDescriptionChange}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Left Tabs for Parameters, Request, Response */}
        <div className='border-b mb-4'>
          <nav className='flex space-x-4'>
            {['parameters', 'request', 'response'].map((tab) => (
              <a
                key={tab}
                href='#'
                className={`px-2 py-1 ${activeLeftTab === tab ? 'border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </a>
            ))}
          </nav>
        </div>

        <div>
          {activeLeftTab === 'parameters' && (
            <Parameters paramsChange={handleParamsChange} initialValues={apiDetail?.parameters} />
          )}
          {activeLeftTab === 'request' && (
            <Request requestChange={handleRequestChange} initialValues={apiDetail?.request || {}} />
          )}
          {activeLeftTab === 'response' && (
            <Response responseChange={handleResponseChange} initialValues={apiDetail?.response || []} />
          )}
        </div>
      </div>

      <div
        className={`transition-width duration-300 p-8 mr-[50px] relative overflow-y-auto ${
          activeRightTab ? 'w-[500px] min-w-[500px] max-w-[500px]' : 'w-[350px] min-w-[350px] max-w-[350px]'
        } ${activeRightTab ? 'border-l' : ''} sidebar-scrollbar h-[775px] pb-5`}
      >
        {activeRightTab && (
          <button
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
            onClick={() => setActiveRightTab(null)}
          >
            <FiX size={20} />
          </button>
        )}
        {activeRightTab === 'summary' && (
          <Summary
            apiDetail={apiDetail?.name}
            method={apiDetail?.method}
            methodStyles={methodStyles}
            apiUrl={apiDetail?.path}
            description={apiDetail?.description}
            params={apiDetail?.parameters}
            request={apiDetail?.request}
            response={apiDetail?.response}
          />
        )}
        {activeRightTab === 'comment' && <Comments />}
        {activeRightTab === 'code' && (
          <CodeSnippet
            path={apiDetail?.path}
            method={apiDetail?.method}
            parameters={apiDetail.parameters}
            request={apiDetail.request}
          />
        )}
      </div>

      <div className='absolute right-0 top-[104px] h-[calc(100vh-104px)] w-[50px] flex flex-col items-center pt-4 bg-white shadow-lg'>
        <FiMessageSquare
          className={`cursor-pointer mb-4 ${activeRightTab === 'comment' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('comment')}
        />
        <FiCode
          className={`cursor-pointer mb-4 ${activeRightTab === 'code' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('code')}
        />
        <FiFileText
          className={`cursor-pointer mb-4 ${activeRightTab === 'summary' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('summary')}
        />
      </div>
    </div>
  );
};

export default ApiDocsDetail;
