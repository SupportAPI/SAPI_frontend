import { useApiDocs } from '../api/queries/useApiDocsQueries';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';

const AllApiDocs = () => {
  const { data = [], isLoading, error } = useApiDocs();

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='p-4'>
      <h2 className='text-lg font-bold mb-4'>API Docs</h2>
      <table className='min-w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='p-2 text-left'>Category</th>
            <th className='p-2 text-left'>API Name</th>
            <th className='p-2 text-left'>HTTP Method</th>
            <th className='p-2 text-left'>API Path</th>
            <th className='p-2 text-left'>Description</th>
            <th className='p-2 text-left'>Manager</th>
            <th className='p-2 text-left'>LS</th>
            <th className='p-2 text-left'>SS</th>
            <th className='p-2 text-left'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) =>
            category.apis.map((api) => (
              <tr key={api.id} className='border-b hover:bg-gray-100'>
                <td className='p-2'>{category.category}</td>
                <td className='p-2'>{api.name}</td>
                <td className='p-2'>{api.method || 'GET'}</td>
                <td className='p-2'>{api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}</td>
                <td className='p-2'>{api.description || 'Description of the API'}</td>
                <td className='p-2'>박용빈</td>
                <td className='p-2 text-center'>
                  <FaCheck className='text-green-600' />
                </td>
                <td className='p-2 text-center'>
                  <FaTimes className='text-red-600' />
                </td>
                <td className='p-2 text-center'>
                  <FaTrashAlt className='text-gray-600 cursor-pointer' />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllApiDocs;
