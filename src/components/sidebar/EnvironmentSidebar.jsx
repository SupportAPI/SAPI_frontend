import { useLocation, useNavigate } from 'react-router-dom';
import { useTabStore } from '../../stores/useTabStore';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';

const EnvironmentSidebar = () => {
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams();
  const [showInputEnvironment, setShowInputEnvironment] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState({ name: '' });
  const [addTime, setAddTime] = useState(false);
  const [addId, setAddId] = useState(2); // 임시값, 첫 id는 1로 시작
  const [paths, setPaths] = useState([{ id: 1, name: 'Global', path: `/workspace/${workspaceId}/environment/1` }]);

  const handleAddEnvironment = () => {
    setShowInputEnvironment(true);
  };

  const handleDashboardClick = (id) => {
    if (!workspaceId) return;

    const selectedPath = paths.find((item) => item.id === id);

    if (selectedPath) {
      addTab({
        id: selectedPath.id,
        name: selectedPath.name,
        path: selectedPath.path,
      });

      navigate(selectedPath.path);
    }
  };

  const handleDashboardDoubleClick = (id) => {
    confirmTab(id);
  };

  const handleNameChange = (e) => {
    setNewEnvironment((prev) => ({ ...prev, name: e.target.value }));
  };

  const addEnvironment = () => {
    setAddTime(true);
  };

  useEffect(() => {
    if (addTime) {
      const newPath = {
        id: addId,
        name: newEnvironment.name,
        path: `/workspace/${workspaceId}/environment/${addId}`,
      };
      setPaths((prevPaths) => [...prevPaths, newPath]);
      setAddId((prevId) => prevId + 1); // 고유한 id 증가
      setShowInputEnvironment(false);
      setNewEnvironment({ name: '' });
      setAddTime(false); // 다음 호출을 위해 리셋
    }
  }, [addTime]);

  return (
    <div className='w-[300px] bg-[#F0F5F8]/50 h-full border-r flex flex-col text-sm'>
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 z-10'>
        <div className='flex items-center'>
          <FaPlus className='text-gray-600 cursor-pointer mr-2' onClick={handleAddEnvironment} />
          <div className='flex items-center flex-1 bg-white rounded border'>
            <FaSearch className='text-gray-400 ml-2' />
            <input type='text' placeholder='Search' className='p-2 flex-1 bg-transparent outline-none' />
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
        <div className='cursor-pointer text-[#475467] '>
          <ul>
            {paths.map((p) => {
              const isActive = location.pathname === p.path;
              return (
                <li
                  key={p.id}
                  className={`cursor-pointer w-full relative ${
                    isActive ? 'bg-blue-100 text-blue-800 hover:bg-gray-300 font-semibold' : 'hover:bg-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDashboardClick(p.id);
                  }}
                  onDoubleClick={() => handleDashboardDoubleClick(p.id)}
                >
                  <div className='pl-12 pr-4 py-2 flex justify-between items-center'>{p.name}</div>
                </li>
              );
            })}
          </ul>
          {showInputEnvironment && (
            <input
              type='text'
              value={newEnvironment?.name}
              onChange={handleNameChange}
              placeholder='환경변수 이름을 입력해주세요'
              className='cursor-pointer w-full relative py-2 pl-12 pr-4 bg-transparent border-none outline-none'
              onKeyDown={(e) => {
                if (e.key === 'Enter') addEnvironment();
              }}
              onBlur={addEnvironment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSidebar;
