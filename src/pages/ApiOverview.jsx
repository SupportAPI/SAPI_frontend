import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDetailApiDocs, useExportDocument, useExportDocumentList } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useTabStore } from '../stores/useTabStore';
import { FaCheck, FaTimes, FaTrashAlt, FaPlus, FaShareAlt, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useWebSocket } from '../contexts/WebSocketProvider';
import { GoDotFill } from 'react-icons/go';

const ApiOverview = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setMenu } = useNavbarStore();
  const { addTab, openTabs } = useTabStore();
  const { mutate: handleExport, isLoading: isExportLoading } = useExportDocumentList();
  const { subscribe, publish, isConnected } = useWebSocket();
  const { data: apiData = [], refetch } = useDetailApiDocs(workspaceId);
  const dropdownRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExportClick = (ext) => {
    setIsDropdownOpen(false);
    const selected = Object.keys(selectedItems);
    handleExport({ workspaceId, ext, selectedDocs: selected });
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
    if (location.pathname === `/workspace/${workspaceId}/apidocs/all`) {
      const existingTab = openTabs.find((tab) => tab.path === location.pathname);
      if (!existingTab) {
        addTab({
          id: 'all',
          name: 'API Overview',
          path: location.pathname,
          type: 'dashboard',
        });
      }
    }
  }, [location, workspaceId, setMenu, addTab, openTabs]);

  useEffect(() => {
    const allSelected = apiData.length > 0 && apiData.every((api) => selectedItems[api.docId]);
    setIsAllSelected(allSelected);
  }, [selectedItems, apiData]);

  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newSelectedItems = {};
    apiData.forEach((api) => {
      newSelectedItems[api.docId] = newSelectedState;
    });
    setSelectedItems(newSelectedItems);
    setIsAllSelected(newSelectedState);
  };

  const handleCheckboxChange = (apiId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [apiId]: !prev[apiId],
    }));
  };

  const handleRowClick = (apiId) => {
    navigate(`/workspace/${workspaceId}/apidocs/${apiId}`);
  };

  const handleDeleteSelected = () => {
    const hasSelectedItems = Object.values(selectedItems).some((isSelected) => isSelected);
    if (!hasSelectedItems) {
      toast.error('삭제할 항목이 없습니다.');
      return;
    }
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    Object.keys(selectedItems).forEach((docId) => {
      if (selectedItems[docId]) {
        console.log(docId);
        publish(`/ws/pub/workspaces/${workspaceId}/docs`, {
          type: 'DELETE',
          message: docId,
        });
      }
    });
    setSelectedItems({});
    setShowDeleteModal(false);
  };

  const handleAddApiDoc = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/docs`, {
      type: 'ADD',
      message: '',
    });
  };

  return (
    <div className='px-8 py-8 overflow-x-auto'>
      <div className='flex justify-between items-baseline mb-8'>
        <h2 className='text-2xl font-bold'>API Overview</h2>
        <div className='flex space-x-2'>
          <button
            onClick={handleAddApiDoc}
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
          >
            <FaPlus />
            <span>Add</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
          >
            <FaTrashAlt />
            <span>Delete</span>
          </button>
          <div className='relative inline-block text-left' ref={dropdownRef}>
            <button
              className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <FaDownload />
              <span>Export</span>
            </button>
            {isDropdownOpen && (
              <div className='absolute left-0 mt-2 w-25 bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                <div className='py-1'>
                  {['MARKDOWN', 'HTML'].map((ext) => (
                    <button
                      key={ext}
                      onClick={() => handleExportClick(ext)}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left'
                    >
                      {ext}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 모달 */}
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

      <div className='overflow-x-auto mx-auto border border-gray-300 rounded-sm'>
        <table className='w-full table-fixed' style={{ borderSpacing: 0 }}>
          <thead>
            <tr className='bg-gray-100 h-12'>
              <th className='p-4 text-center font-medium w-[5%] cursor-default' onClick={() => toggleSelectAll()}>
                <div className='flex items-center justify-center'>
                  <input
                    type='checkbox'
                    className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500 cursor-default'
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </div>
              </th>
              <th className='p-4 text-left font-medium w-[15%]'>Category</th>
              <th className='p-4 text-left font-medium w-[15%]'>API Name</th>
              <th className='p-4 text-left font-medium w-[10%]'>HTTP</th>
              <th className='p-4 text-left font-medium w-[20%]'>API Path</th>
              <th className='p-4 text-left font-medium w-[15%]'>Description</th>
              <th className='p-4 text-center font-medium w-[5%]'>LS</th>
              <th className='p-4 text-center font-medium w-[5%]'>SS</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((api) => {
              const isSelected = !!selectedItems[api.docId];
              return (
                <tr
                  key={api.docId}
                  onClick={() => handleRowClick(api.apiId)}
                  className={`text-[14px] cursor-pointer ${
                    isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <td
                    className='p-4 text-center cursor-default'
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 전파 방지
                      handleCheckboxChange(api.docId);
                    }}
                  >
                    <div className='flex items-center justify-center'>
                      <input
                        type='checkbox'
                        className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500 cursor-'
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 이벤트 전파 방지
                        onChange={() => handleCheckboxChange(api.docId)}
                      />
                    </div>
                  </td>
                  <td className='p-4 truncate'>{api.category || 'Uncategorized'}</td>
                  <td className='p-4 truncate'>{api.name || 'Unnamed API'}</td>
                  <td className='p-4 truncate'>{api.method || 'GET'}</td>
                  <td className='p-4 truncate'>{api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}</td>
                  <td className='p-4 truncate'>{api.description}</td>
                  <td className='p-4 text-center'>
                    {api.localStatus === 'PENDING' ? (
                      <GoDotFill className='text-gray-500 mx-auto' />
                    ) : api.localStatus === 'SUCCESS' ? (
                      <FaCheck className='text-green-600 mx-auto' />
                    ) : (
                      <FaTimes className='text-red-600 mx-auto' />
                    )}
                  </td>
                  <td className='p-4 text-center'>
                    {api.serverStatus === 'PENDING' ? (
                      <GoDotFill className='text-gray-500 mx-auto' />
                    ) : api.localStatus === 'SUCCESS' ? (
                      <FaCheck className='text-green-600 mx-auto' />
                    ) : (
                      <FaTimes className='text-red-600 mx-auto' />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiOverview;
