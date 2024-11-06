import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDetailApiDocs } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useTabStore } from '../stores/useTabStore';
import { FaCheck, FaTimes, FaTrashAlt, FaPlus, FaShareAlt, FaDownload } from 'react-icons/fa';
import { useWebSocket } from '../contexts/WebSocketContext';

const ApiOverview = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setMenu } = useNavbarStore();
  const { addTab, openTabs } = useTabStore();

  const { subscribe, publish, isConnected } = useWebSocket();
  const { data: apiData = [], refetch } = useDetailApiDocs(workspaceId);

  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // WebSocket 연결이 되어있을 때만 구독을 설정
    if (isConnected) {
      const subscription = subscribe(`/ws/sub/workspaces/${workspaceId}/docs`, (message) => {
        console.log('Received WebSocket message:', message);
        refetch(); // 메시지를 받으면 데이터 갱신
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [isConnected, workspaceId, subscribe, refetch]);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspaceId}/apidocs/all`) {
      setMenu('API Docs');
      const existingTab = openTabs.find((tab) => tab.path === location.pathname);
      if (!existingTab) {
        addTab({
          id: 'all',
          name: 'API Overview',
          path: location.pathname,
        });
      }
    }
  }, [location, workspaceId, setMenu, addTab, openTabs]);

  useEffect(() => {
    const allSelected = apiData.every((api) => selectedItems[api.docId]);
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
      <div className='flex justify-between items-baseline mb-4'>
        <h2 className='text-2xl font-bold'>API Overview</h2>
        <div className='flex space-x-4'>
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

      <div className='overflow-x-auto mx-auto border border-gray-300 rounded-lg'>
        <table className='w-full min-w-[1200px] table-fixed' style={{ borderSpacing: 0 }}>
          <thead>
            <tr className='bg-gray-100 h-12'>
              <th className='p-4 text-center font-medium w-[5%]'>
                <div className='flex items-center justify-center'>
                  <input
                    type='checkbox'
                    className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </div>
              </th>
              <th className='p-4 text-left font-medium w-[15%]'>Category</th>
              <th className='p-4 text-left font-medium w-[20%]'>API Name</th>
              <th className='p-4 text-left font-medium w-[10%]'>HTTP</th>
              <th className='p-4 text-left font-medium w-[25%]'>API Path</th>
              <th className='p-4 text-center font-medium w-[15%]'>Manager</th>
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
                  onClick={() => handleRowClick(api.docId)}
                  className={`text-[14px] cursor-pointer ${
                    isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className='p-4 text-center'>
                    <div className='flex items-center justify-center'>
                      <input
                        type='checkbox'
                        className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleCheckboxChange(api.docId)}
                      />
                    </div>
                  </td>
                  <td className='p-4'>{api.category || 'Uncategorized'}</td>
                  <td className='p-4'>{api.name || 'Unnamed API'}</td>
                  <td className='p-4'>{api.method || 'GET'}</td>
                  <td className='p-4'>{api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}</td>
                  <td className='p-4 text-center'>{api.manager_id || 'N/A'}</td>
                  <td className='p-4 text-center'>
                    {api.localStatus === 'PENDING' ? (
                      <FaTimes className='text-red-600 mx-auto' />
                    ) : (
                      <FaCheck className='text-green-600 mx-auto' />
                    )}
                  </td>
                  <td className='p-4 text-center'>
                    {api.serverStatus === 'PENDING' ? (
                      <FaTimes className='text-red-600 mx-auto' />
                    ) : (
                      <FaCheck className='text-green-600 mx-auto' />
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
