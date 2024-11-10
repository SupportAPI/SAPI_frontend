import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight, FaPlus, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useTabStore } from '../../stores/useTabStore';
import { useApiDocs } from '../../api/queries/useApiDocsQueries';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../contexts/WebSocketContext';

const ApiDocsSidebar = () => {
  const { data = [], error, refetch } = useApiDocs();
  const { expandedCategories, toggleCategory, setAllCategories } = useSidebarStore();
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const { subscribe, publish, isConnected } = useWebSocket();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApiId, setSelectedApiId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleAddApiDoc = () => {
    if (workspaceId) {
      publish(`/ws/pub/workspaces/${workspaceId}/docs`, { type: 'ADD', message: '' });
      toast('새로운 API 문서가 추가되었습니다.');
    }
  };

  const handleApiClick = (apiId, apiName) => {
    if (!workspaceId) return;
    const path = `/workspace/${workspaceId}/apidocs/${apiId}`;
    addTab({
      id: apiId,
      name: apiName,
      path,
    });
    navigate(path);
  };

  const handleApiDoubleClick = (apiId) => {
    confirmTab(apiId);
  };

  const handleCategoryToggle = (category) => {
    toggleCategory(category);
  };

  const handleAllApiClick = () => {
    handleApiClick('all', 'API Overview');
  };

  const handleAllApiDoubleClick = () => {
    confirmTab('all');
  };

  const handleDropdownToggle = (apiId) => {
    setActiveDropdown((prev) => (prev === apiId ? null : apiId));
  };

  const handleCopyLink = (e, apiId) => {
    e.stopPropagation();
    const link = `${window.location.origin}/workspace/${workspaceId}/apidocs/${apiId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast('클립보드에 복사되었습니다.');
    });
    setActiveDropdown(null);
  };

  const handleDelete = (e, docId) => {
    e.stopPropagation();
    setSelectedApiId(docId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedApiId && workspaceId) {
      publish(`/ws/pub/workspaces/${workspaceId}/docs`, { type: 'DELETE', message: selectedApiId });
      toast('API 문서가 삭제되었습니다.');
      setSelectedApiId(null);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const subscription = subscribe(`/ws/sub/workspaces/${workspaceId}/docs`, (message) => {
        console.log('Received WebSocket message:', message);
        refetch();
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [isConnected, workspaceId, subscribe, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색어에 맞게 데이터 필터링
  useEffect(() => {
    if (searchTerm) {
      // 검색어가 있을 때 필터링
      const filtered = data
        .map((category) => ({
          ...category,
          apis: category.apis.filter((api) => api.name.toLowerCase().includes(searchTerm.toLowerCase())),
        }))
        .filter((category) => category.apis.length > 0);

      // 상태가 변경될 때만 업데이트
      if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
        setFilteredData(filtered);
      }
    } else {
      // 검색어가 없을 때 전체 데이터를 사용
      if (JSON.stringify(data) !== JSON.stringify(filteredData)) {
        setFilteredData(data);
      }
    }
  }, [searchTerm, data, filteredData]);

  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='w-[300px] bg-[#F0F5F8]/50 h-full border-r flex flex-col text-sm'>
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 z-10'>
        <div className='flex items-center'>
          <FaPlus className='text-gray-600 cursor-pointer mr-2' onClick={handleAddApiDoc} />
          <div className='flex items-center flex-1 bg-white rounded border relative'>
            <FaSearch className='text-gray-400 ml-2' />
            <input
              type='text'
              placeholder='Search by State'
              className='p-2 flex-1 bg-transparent outline-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FaTimes className='text-gray-400 cursor-pointer absolute right-2' onClick={() => setSearchTerm('')} />
            )}
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center px-4 mb-2 h-10'>
        <div
          className='flex items-center cursor-pointer hover:bg-gray-200'
          onClick={handleAllApiClick}
          onDoubleClick={handleAllApiDoubleClick}
        >
          <FaBars className='text-gray-500 mr-2' />
          <span className='text-lg font-semibold text-[#475467]'>API Overview</span>
        </div>
        <div className='flex space-x-2'>
          <BiExpandVertical
            onClick={() => setAllCategories(data, true)}
            className='text-blue-600 cursor-pointer hover:text-blue-800'
            title='Expand All'
          />
          <BiCollapseVertical
            onClick={() => setAllCategories(data, false)}
            className='text-blue-600 cursor-pointer hover:text-blue-800'
            title='Collapse All'
          />
        </div>
      </div>

      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-xl font-bold mb-4'>삭제하시겠습니까?</h3>
            <p className='mb-6'>선택한 API 문서를 삭제하시겠습니까?</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
              >
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

      <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
        <div>
          {filteredData.map((category) => (
            <div key={category.category}>
              <div
                className='flex items-center px-4 py-1 text-[#475467] cursor-pointer h-10 hover:bg-gray-300'
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryToggle(category.category);
                }}
              >
                {expandedCategories[category.category] ? (
                  <FaChevronDown className='mr-2' />
                ) : (
                  <FaChevronRight className='mr-2' />
                )}
                {category.category}
              </div>
              {expandedCategories[category.category] && (
                <ul>
                  {category.apis.map((api) => {
                    const isActive = location.pathname === `/workspace/${workspaceId}/apidocs/${api.apiId}`;
                    const isDropdownActive = activeDropdown === api.apiId;
                    return (
                      <li
                        key={api.apiId}
                        className={`cursor-pointer w-full relative group ${
                          isActive ? 'bg-blue-100 text-blue-800 font-semibold' : ''
                        } ${isDropdownActive ? 'bg-gray-300' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApiClick(api.apiId, api.name);
                        }}
                        onDoubleClick={() => handleApiDoubleClick(api.apiId)}
                      >
                        <div className='pl-12 pr-4 py-2 flex justify-between items-center'>
                          {api.name}
                          <BsThreeDots
                            className={`text-gray-500 hover:text-gray-700 cursor-pointer ${
                              isDropdownActive || 'group-hover:opacity-100 opacity-0'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(api.apiId);
                            }}
                          />
                        </div>
                        {isDropdownActive && (
                          <div
                            ref={dropdownRef}
                            className='absolute right-0 w-28 bg-white shadow-lg rounded border z-20'
                          >
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                              onClick={(e) => handleCopyLink(e, api.apiId)}
                            >
                              Copy Link
                            </button>
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                              onClick={(e) => handleDelete(e, api.docId)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDocsSidebar;
