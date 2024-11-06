import { FaChevronDown, FaPlus, FaSearch } from 'react-icons/fa';
import { useTabStore } from '../../stores/useTabStore';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EnvironmentSidebar = () => {
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams();

  const paths = [{ id: 1, name: 'Global', path: `/workspace/${workspaceId}/environment/global` }];

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

  return (
    <div className='w-[300px] bg-[#F0F5F8]/50 h-full border-r flex flex-col text-sm'>
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 z-10'>
        <div className='flex items-center'>
          <FaPlus className='text-gray-600 cursor-pointer mr-2' />
          <div className='flex items-center flex-1 bg-white rounded border'>
            <FaSearch className='text-gray-400 ml-2' />
            <input type='text' placeholder='Search' className='p-2 flex-1 bg-transparent outline-none' />
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto scrollbar'>
        <div>
          <div className='flex items-center px-2 py-1 text-[#475467] cursor-pointer'>
            <FaChevronDown className='mr-2' />
            Environment
          </div>
          <ul className='pl-4'>
            {paths.map((p) => {
              const isActive = location.pathname === p.path;
              return (
                <li
                  key={p.id}
                  className={`cursor-pointer w-full relative ${
                    isActive ? 'bg-blue-100 text-blue-800 font-semibold' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDashboardClick(p.id);
                  }}
                  onDoubleClick={() => {
                    handleDashboardDoubleClick(p.id);
                  }}
                >
                  <div className='pl-12 pr-4 py-2 flex justify-between items-center'>{p.name}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSidebar;
