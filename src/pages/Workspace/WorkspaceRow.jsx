import { useState, useRef, useEffect } from 'react';
import { SlOptions } from 'react-icons/sl';
import OptionMenu from './OptionMenu';

const WorkspaceRow = ({ workspace, onWorkspaceSelect, onModifyWorkspace, onDeleteWorkspace }) => {
  const [showOptions, setShowOptions] = useState(false);
  const rowRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rowRef.current && !rowRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <tr
      className='border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-hover'
      onClick={() => onWorkspaceSelect(workspace.id)}
      ref={rowRef}
    >
      <td className='p-2 w-[23%]'>
        <div className='flex items-center'>
          <img src={workspace.mainImage} alt='icon' className='min-w-[50px] max-w-[50px] h-auto rounded-lg' />
          <div className='ml-3'>{workspace.projectName}</div>
        </div>
      </td>
      <td className='p-2 w-[30%]'>{workspace.description}</td>
      <td className='p-2 w-[25%]'>{workspace.id}</td>
      <td className='p-2 w-[25%] text-center'>
        <button
          className='inline-block'
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
        >
          <SlOptions />
        </button>
        {showOptions && (
          <OptionMenu
            workspace={workspace}
            onModifyWorkspace={onModifyWorkspace}
            onDeleteWorkspace={onDeleteWorkspace}
          />
        )}
      </td>
    </tr>
  );
};

export default WorkspaceRow;
