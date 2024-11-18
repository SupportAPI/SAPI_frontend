const OptionMenu = ({ workspace, onModifyWorkspace, onDeleteWorkspace }) => {
  return (
    <div className='absolute bg-white shadow-lg rounded-lg z-10'>
      <button
        className='block w-full text-left p-2 hover:bg-gray-100'
        onClick={() => onModifyWorkspace(workspace.id, !workspace.isCompleted)}
      >
        {workspace.isCompleted ? '완료 취소' : '프로젝트 완료'}
      </button>
      <button
        className='block w-full text-left p-2 text-red-500 hover:bg-red-100'
        onClick={() => onDeleteWorkspace(workspace.id)}
      >
        DELETE
      </button>
    </div>
  );
};

export default OptionMenu;
