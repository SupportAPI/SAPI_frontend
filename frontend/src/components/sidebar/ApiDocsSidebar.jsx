import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight, FaPlus, FaSearch, FaBars } from 'react-icons/fa';
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useTabStore } from '../../stores/useTabStore';
import { useApiDocs } from '../../api/queries/useApiDocsQueries';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ApiDocsSidebar = () => {
  const { data = [], isLoading, error } = useApiDocs();
  const { expandedCategories, toggleCategory, setAllCategories } = useSidebarStore();
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const handleApiClick = (apiId, apiName) => {
    if (!workspaceId) return;

    const path = `/workspace/${workspaceId}/apidocs/${apiId}`;

    addTab({
      id: apiId,
      name: apiName,
      path,
    });

    navigate(path);
  };

  const handleApiDoubleClick = (apiId) => {
    confirmTab(apiId);
  };

  const handleCategoryToggle = (category) => {
    toggleCategory(category);
  };

  const handleAllApiClick = () => {
    handleApiClick('all', 'API Overview');
  };

  const handleAllApiDoubleClick = () => {
    confirmTab('all');
  };

  const handleDropdownToggle = (apiId) => {
    setActiveDropdown((prev) => (prev === apiId ? null : apiId));
  };

  const handleCopyLink = (e, apiId) => {
    e.stopPropagation();
    const link = `${window.location.origin}/workspace/${workspaceId}/apidocs/${apiId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    });
    setActiveDropdown(null);
  };

  const handleDelete = (e, apiId) => {
    e.stopPropagation();
    alert(`API ${apiId} 삭제 요청`);
    setActiveDropdown(null);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;

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
      <div className='flex justify-between items-center px-4 mb-2 h-10'>
        <div
          className='flex items-center cursor-pointer hover:bg-gray-200'
          onClick={handleAllApiClick}
          onDoubleClick={handleAllApiDoubleClick}
        >
          <FaBars className='text-gray-500 mr-2' />
          <span className='text-lg font-semibold text-[#475467]'>API Overview</span>
        </div>
        <div className='flex space-x-2'>
          <BiExpandVertical
            onClick={() => setAllCategories(data, true)}
            className='text-blue-600 cursor-pointer hover:text-blue-800'
            title='Expand All'
          />
          <BiCollapseVertical
            onClick={() => setAllCategories(data, false)}
            className='text-blue-600 cursor-pointer hover:text-blue-800'
            title='Collapse All'
          />
        </div>
      </div>
      <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
        <div>
          {data.map((category) => (
            <div key={category.category}>
              <div
                className='flex items-center px-4 py-1 text-[#475467] cursor-pointer h-10 hover:bg-gray-300'
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryToggle(category.category);
                }}
              >
                {expandedCategories[category.category] ? (
                  <FaChevronDown className='mr-2' />
                ) : (
                  <FaChevronRight className='mr-2' />
                )}
                {category.category}
              </div>
              {expandedCategories[category.category] && (
                <ul>
                  {category.apis.map((api) => {
                    const isActive = location.pathname === `/workspace/${workspaceId}/apidocs/${api.id}`;
                    const isDropdownActive = activeDropdown === api.id;
                    return (
                      <li
                        key={api.id}
                        className={`cursor-pointer w-full relative group ${
                          isActive ? 'bg-blue-100 text-blue-800 font-semibold' : ''
                        } ${isDropdownActive ? 'bg-gray-300' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApiClick(api.id, api.name);
                        }}
                        onDoubleClick={() => handleApiDoubleClick(api.id)}
                      >
                        <div className='pl-12 pr-4 py-2 flex justify-between items-center'>
                          {api.name}
                          <BsThreeDots
                            className={`text-gray-500 hover:text-gray-700 cursor-pointer ${
                              isDropdownActive || 'group-hover:opacity-100 opacity-0'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(api.id);
                            }}
                          />
                        </div>
                        {isDropdownActive && (
                          <div
                            ref={dropdownRef}
                            className='absolute right-0 w-28 bg-white shadow-lg rounded border z-20'
                          >
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                              onClick={(e) => handleCopyLink(e, api.id)}
                            >
                              Copy Link
                            </button>
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                              onClick={(e) => handleDelete(e, api.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDocsSidebar;
