import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useApiDocs } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useTabStore } from '../stores/useTabStore';
import { FaCheck, FaTimes, FaTrashAlt, FaPlus, FaShareAlt, FaDownload } from 'react-icons/fa';

const ApiOverview = () => {
  const { data = [], isLoading, error } = useApiDocs();
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // navigate 선언
  const { setMenu } = useNavbarStore();
  const { addTab, openTabs } = useTabStore();

  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);

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

  // 전체 선택 상태 변경 로직
  useEffect(() => {
    const allSelected = data.every((category) => category.apis.every((api) => selectedItems[api.id]));
    setIsAllSelected(allSelected);
  }, [selectedItems, data]);

  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newSelectedItems = {};
    data.forEach((category) =>
      category.apis.forEach((api) => {
        newSelectedItems[api.id] = newSelectedState;
      })
    );
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
    navigate(`/workspace/${workspaceId}/apidocs/${apiId}`); // 클릭 시 해당 API로 이동
  };

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='p-8 overflow-x-auto'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-2xl font-bold'>API Overview</h2>
        <div className='flex space-x-4'>
          <button className='flex items-center h-10 space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaPlus />
            <span>Add</span>
          </button>
          <button className='flex items-center h-10 space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaTrashAlt />
            <span>Delete</span>
          </button>
          <button className='flex items-center h-10 space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaDownload />
            <span>Export</span>
          </button>
          <button className='flex items-center h-10 space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>
      <hr className='border-t border-gray-300 mb-4' />
      <div className='overflow-x-auto mx-auto border border-gray-300 rounded-lg'>
        <table className='w-full min-w-[1200px] table-fixed' style={{ borderSpacing: 0 }}>
          <thead>
            <tr className='bg-gray-100 h-12'>
              <th className='p-4 w-[1%]'></th>
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
              <th className='p-4 text-left font-medium w-[18%]'>API Name</th>
              <th className='p-4 text-left font-medium w-[10%]'>HTTP</th>
              <th className='p-4 text-left font-medium w-[25%]'>API Path</th>
              <th className='p-4 text-center font-medium w-[15%]'>Manager</th>
              <th className='p-4 text-center font-medium w-[5%]'>LS</th>
              <th className='p-4 text-center font-medium w-[5%]'>SS</th>
              <th className='p-4 w-[1%]'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) =>
              category.apis.map((api) => {
                const isSelected = !!selectedItems[api.id];
                return (
                  <tr
                    key={api.id}
                    onClick={() => handleRowClick(api.id)} // 행 클릭 이벤트 추가
                    className={`text-[14px] cursor-pointer ${
                      isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className='p-4'></td>
                    <td className='p-4 text-center'>
                      <div className='flex items-center justify-center'>
                        <input
                          type='checkbox'
                          className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()} // 이벤트 전파 막기
                          onChange={() => handleCheckboxChange(api.id)} // 상태 변경 함수
                        />
                      </div>
                    </td>
                    <td className='p-4'>{category.category}</td>
                    <td className='p-4'>{api.name}</td>
                    <td className='p-4'>{api.method || 'GET'}</td>
                    <td className='p-4'>{api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}</td>
                    <td className='p-4 text-center'>박용빈</td>
                    <td className='p-4 text-center'>
                      <FaCheck className='text-green-600 mx-auto' />
                    </td>
                    <td className='p-4 text-center'>
                      <FaTimes className='text-red-600 mx-auto' />
                    </td>
                    <td className='p-4' />
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiOverview;
