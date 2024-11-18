import React from 'react';

const WorkspaceRow = ({ workspace, onClick, setIsModalOpen, setDeleteWorkspaceId }) => {
  return (
    <tr className='border-b cursor-pointer hover:bg-gray-50' onClick={onClick}>
      <td className='p-2 w-[23%]'>
        <div className='flex items-center ml-3'>
          <img
            src={workspace.mainImage}
            alt='icon'
            className='border min-w-[60px] max-w-[60px] min-h-[50px] max-h-[50px] rounded-lg object-contain'
          />
          <div className='ml-3'>{workspace.projectName}</div>
        </div>
      </td>
      <td className='p-2 w-[30%]'>{workspace.description}</td>
      <td className='p-2 w-[25%]'>{workspace.id}</td>
      <td className='p-2 w-[25%]'>
        <button
          className='text-red-500'
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
            setDeleteWorkspaceId(workspace.id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default WorkspaceRow;
