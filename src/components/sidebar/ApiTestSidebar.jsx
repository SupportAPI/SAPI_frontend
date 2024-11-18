import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useTabStore } from '../../stores/useTabStore';
import { useFetchApiList } from '../../api/queries/useApiTestQueries';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ApiTestSidebar = () => {
  const { expandedCategories, toggleCategory, setAllCategories } = useSidebarStore();
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { data: dataTest = [], error } = useFetchApiList(workspaceId);
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [groupedData, setGroupedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const groupDataByCategory = (data) => {
    const grouped = data.reduce((acc, item) => {
      const { category } = item;
      if (!acc[category]) {
        acc[category] = { category, apis: [] };
      }
      acc[category].apis.push(item);
      return acc;
    }, {});

    return Object.values(grouped);
  };

  useEffect(() => {
    if (dataTest.length > 0) {
      const grouped = groupDataByCategory(dataTest);
      setGroupedData(grouped);
      setFilteredData(grouped);
    }
  }, [dataTest]);

  useEffect(() => {
    const filterData = () => {
      if (!searchTerm) {
        setFilteredData(groupedData);
        return;
      }

      const filtered = groupedData
        .map((categoryData) => ({
          ...categoryData,
          apis: categoryData.apis.filter((api) => api.name.toLowerCase().includes(searchTerm.toLowerCase())),
        }))
        .filter((categoryData) => categoryData.apis.length > 0);

      setFilteredData(filtered);
    };

    filterData();
  }, [searchTerm, groupedData]);

  const handleApiClick = (apiId, apiName) => {
    if (!workspaceId) return;
    const path = `/workspace/${workspaceId}/api-test/${apiId}`;
    addTab({
      id: apiId,
      name: apiName,
      path,
      type: 'api-test',
    });
    navigate(path);
  };

  const handleApiDoubleClick = (apiId) => {
    confirmTab(apiId, 'api-test');
  };

  const handleCategoryToggle = (category) => {
    toggleCategory(category);
  };

  const handleAllApiClick = () => {
    const path = `/workspace/${workspaceId}/api-test`;
    addTab({
      id: 'api-test',
      name: 'API Test',
      path,
      type: 'api-test',
    });
    navigate(path);
  };

  const handleAllApiDoubleClick = () => {
    confirmTab('api-test', 'api-test');
  };

  const handleDropdownToggle = (apiId) => {
    setActiveDropdown((prev) => (prev === apiId ? null : apiId));
  };

  const handleCopyLink = (e, apiId) => {
    e.stopPropagation();
    const link = `${window.location.origin}/workspace/${workspaceId}/api-test/${apiId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast('클립보드에 복사되었습니다.');
    });
    setActiveDropdown(null);
  };

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

  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='w-[300px] bg-[#F0F5F8]/50 dark:bg-dark-background dark:text-dark-text h-full border-r flex flex-col text-sm'>
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 dark:bg-dark-background z-10'>
        <div className='flex items-center'>
          <div className='flex items-center flex-1 bg-white dark:bg-dark-background rounded border relative'>
            <FaSearch className='text-gray-400 dark:text-dark-text ml-2' />
            <input
              type='text'
              placeholder='Search'
              className='p-2 flex-1 bg-transparent outline-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FaTimes
                className='text-gray-400 dark:text-dark-text cursor-pointer absolute right-2'
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center px-4 mb-2 h-10'>
        <div
          className='flex items-center cursor-pointer hover:bg-gray-200'
          onClick={handleAllApiClick}
          onDoubleClick={handleAllApiDoubleClick}
        >
          <FaBars className='text-gray-500 dark:text-dark-text mr-2' />
          <span className='text-[16px] font-semibold text-[#475467] dark:text-dark-text'>API Test</span>
        </div>
        <div className='flex space-x-2'>
          <BiExpandVertical
            onClick={() => setAllCategories(dataTest, true)}
            className='text-blue-600 cursor-pointer hover:text-blue-800 dark:text-dark-text dark:hover:text-dark-hover'
            title='Expand All'
          />
          <BiCollapseVertical
            onClick={() => setAllCategories(dataTest, false)}
            className='text-blue-600 cursor-pointer hover:text-blue-800 dark:text-dark-text dark:hover:text-dark-hover'
            title='Collapse All'
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
        <div>
          {filteredData.map((categoryData) => (
            <div key={categoryData.category}>
              <div
                className='flex items-center px-4 py-1 text-[#475467] dark:text-dark-text cursor-pointer h-10 hover:bg-gray-300 dark:hover:bg-dark-hover'
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryToggle(categoryData.category);
                }}
              >
                {expandedCategories[categoryData.category] ? (
                  <FaChevronDown className='mr-2' />
                ) : (
                  <FaChevronRight className='mr-2' />
                )}
                {categoryData.category}
              </div>
              {expandedCategories[categoryData.category] && (
                <ul>
                  {categoryData.apis.map((api) => {
                    const isActive = location.pathname === `/workspace/${workspaceId}/api-test/${api.apiId}`;
                    const isDropdownActive = activeDropdown === api.apiId;
                    return (
                      <li
                        key={api.apiId}
                        className={`cursor-pointer w-full relative group ${
                          isActive
                            ? 'bg-blue-100 text-blue-800 font-semibold dark:bg-dark-hover dark:text-dark-surface'
                            : ''
                        } ${
                          isDropdownActive ? 'bg-gray-300 dark:bg-black' : 'hover:bg-gray-300 dark:hover:bg-dark-hover'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApiClick(api.apiId, api.name);
                        }}
                        onDoubleClick={() => handleApiDoubleClick(api.apiId)}
                      >
                        <div className='pl-12 pr-4 py-2 flex justify-between items-center'>
                          {api.name}
                          <BsThreeDots
                            className={`text-gray-500 hover:text-gray-700 cursor-pointer ${
                              isDropdownActive || 'group-hover:opacity-100 opacity-0'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(api.apiId);
                            }}
                          />
                        </div>
                        {isDropdownActive && (
                          <div ref={dropdownRef} className='absolute right-0 w-28 bg-white shadow-lg rounded-lg z-20'>
                            <button
                              className='w-full rounded-lg text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal dark:bg-dark-background dark:hover:bg-dark-hover dark:text-dark-text'
                              onClick={(e) => handleCopyLink(e, api.apiId)}
                            >
                              Copy Link
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

export default ApiTestSidebar;
