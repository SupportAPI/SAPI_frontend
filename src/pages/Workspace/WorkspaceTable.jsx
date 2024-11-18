import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import WorkspaceRow from './WorkspaceRow';

const WorkspaceTable = ({ title, workspaces, onWorkspaceSelect, onModifyWorkspace, onDeleteWorkspace }) => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [filter, setFilter] = useState('');

  const filteredWorkspaces = workspaces.filter((ws) => ws.projectName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section className='flex flex-col border rounded-3xl bg-white p-8 mt-5 dark:bg-dark-background'>
      <div className='flex justify-between items-center mb-2'>
        <p className='text-xl font-bold'>{title}</p>
        <button
          className='flex justify-center items-center border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-dark-background'
          onClick={() => setIsTableVisible(!isTableVisible)}
        >
          {isTableVisible ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <div className='border mt-2 mb-2 w-full'></div>
      {isTableVisible && (
        <div className='h-80 overflow-y-auto'>
          <table className='w-full table-fixed custom-table'>
            <thead>
              <tr className='text-left border-b'>
                <th className='p-2 w-[23%]'>
                  <input
                    type='text'
                    className='border-b dark:bg-dark-background'
                    placeholder='Search'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </th>
                <th className='p-2 w-[30%]'>Description</th>
                <th className='p-2 w-[25%]'>Active User</th>
                <th className='p-2 w-[25%]'>Option</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkspaces.map((workspace) => (
                <WorkspaceRow
                  key={workspace.id}
                  workspace={workspace}
                  onWorkspaceSelect={onWorkspaceSelect}
                  onModifyWorkspace={onModifyWorkspace}
                  onDeleteWorkspace={onDeleteWorkspace}
                />
              ))}
              {filteredWorkspaces.length === 0 && (
                <tr>
                  <td colSpan='4' className='text-center py-[100px]'>
                    No Workspaces Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default WorkspaceTable;
