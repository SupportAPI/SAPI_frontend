import React, { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import WorkspaceRow from './WorkspaceRow';
import SearchInput from './SearchInput';

const WorkspaceTable = ({ title, workspaces, onWorkspaceClick, setIsModalOpen, setDeleteWorkspaceId }) => {
  const [filterText, setFilterText] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(true);

  const filteredWorkspaces = workspaces?.filter((workspace) =>
    workspace.projectName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <section className='flex flex-col border rounded-3xl bg-white p-8 mt-5 dark:bg-dark-background'>
      <div className='flex justify-between items-center mb-2'>
        <p className='text-xl font-bold'>{title}</p>
        <button
          className='flex justify-center items-center border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200'
          onClick={() => setIsTableVisible(!isTableVisible)}
        >
          {isTableVisible ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <div className='border mt-2 mb-2 w-full'></div>
      {isTableVisible && (
        <div className='h-80 overflow-y-auto'>
          <SearchInput value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          <table className='w-full table-fixed custom-table'>
            <thead>
              <tr className='text-left border-b'>
                <th className='p-2 w-[23%]'>Workspace</th>
                <th className='p-2 w-[30%]'>Description</th>
                <th className='p-2 w-[25%]'>Active User</th>
                <th className='p-2 w-[25%]'>Option</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkspaces?.length > 0 ? (
                filteredWorkspaces.map((workspace, index) => (
                  <WorkspaceRow
                    key={workspace.id}
                    workspace={workspace}
                    onClick={() => onWorkspaceClick(workspace.id)}
                    setIsModalOpen={setIsModalOpen}
                    setDeleteWorkspaceId={setDeleteWorkspaceId}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center py-[80px]'>
                    <div>No Workspace found</div>
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
