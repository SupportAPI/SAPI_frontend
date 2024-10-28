import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApiDocs } from '../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useTabStore } from '../stores/useTabStore';
import { FaCheck, FaTimes, FaTrashAlt, FaPlus, FaShareAlt, FaDownload } from 'react-icons/fa';

const ApiOverview = () => {
  const { data = [], isLoading, error } = useApiDocs();
  const { workspaceId } = useParams();
  const location = useLocation();
  const { setMenu } = useNavbarStore();
  const { addTab, openTabs } = useTabStore();

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

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>API Overview</h2>
        <div className='flex space-x-4'>
          <button className='flex items-center space-x-2 text-gray-600 hover:text-gray-800'>
            <FaPlus />
            <span>Add</span>
          </button>
          <button className='flex items-center space-x-2 text-gray-600 hover:text-gray-800'>
            <FaTrashAlt />
            <span>Delete</span>
          </button>
          <button className='flex items-center space-x-2 text-gray-600 hover:text-gray-800'>
            <FaDownload />
            <span>Export</span>
          </button>
          <button className='flex items-center space-x-2 text-gray-600 hover:text-gray-800'>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>
      <hr className='border-t border-gray-300 mb-4' />
      <table className='min-w-full border-collapse shadow rounded-lg'>
        <thead>
          <tr className='bg-gray-100 border-b'>
            <th className='p-4 text-left font-medium'>Category</th>
            <th className='p-4 text-left font-medium'>API Name</th>
            <th className='p-4 text-left font-medium'>HTTP Method</th>
            <th className='p-4 text-left font-medium'>API Path</th>
            <th className='p-4 text-left font-medium'>Description</th>
            <th className='p-4 text-left font-medium'>Manager</th>
            <th className='p-4 text-center font-medium'>LS</th>
            <th className='p-4 text-center font-medium'>SS</th>
            <th className='p-4 text-center font-medium'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) =>
            category.apis.map((api) => (
              <tr key={api.id} className='border-b hover:bg-gray-50'>
                <td className='p-4'>{category.category}</td>
                <td className='p-4'>{api.name}</td>
                <td className='p-4'>{api.method || 'GET'}</td>
                <td className='p-4'>{api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}</td>
                <td className='p-4'>{api.description || 'No description available'}</td>
                <td className='p-4'>박용빈</td>
                <td className='p-4 text-center'>
                  <FaCheck className='text-green-600' />
                </td>
                <td className='p-4 text-center'>
                  <FaTimes className='text-red-600' />
                </td>
                <td className='p-4 text-center'>
                  <FaTrashAlt className='text-gray-600 cursor-pointer hover:text-red-500' />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApiOverview;
