import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useFetchApiList } from '../../api/queries/useApiTestQueries';
import { useTabStore } from '../../stores/useTabStore';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { RiDropdownList } from 'react-icons/ri';
import { toast } from 'react-toastify';

const ApiTest = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const { addTab, openTabs } = useTabStore();
  const { data: dataTest = [], isLoading, error } = useFetchApiList(workspaceId);
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (!workspaceId || !location.pathname.startsWith(`/workspace/${workspaceId}/api-test`)) return;

    if (location.pathname === `/workspace/${workspaceId}/api-test`) {
      const existingTab = openTabs.find((tab) => tab.path === location.pathname);
      if (!existingTab) {
        addTab({
          id: 'api-test',
          name: 'API Test',
          path: location.pathname,
          type: 'api-test',
        });
      }
    }
  }, [location, workspaceId, addTab, openTabs]);

  useEffect(() => {
    if (!isLoading) {
      const allSelected = dataTest.every((api) => selectedItems[api.apiId]);
      setIsAllSelected(allSelected);
    }
  }, [selectedItems, dataTest, isLoading]);

  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newSelectedItems = {};
    dataTest.forEach((api) => {
      newSelectedItems[api.apiId] = newSelectedState;
    });
    setSelectedItems(newSelectedItems);
    setIsAllSelected(newSelectedState);
  };

  const handleCheckboxChange = (apiId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [apiId]: !prev[apiId],
    }));
  };

  const handleRowClick = (apiId, apiName) => {
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

  // 검색 필터 상태 관리
  const [search, setSearch] = useState('');
  // Dropdown 상태 관리
  const [isShowEnvironment, setShowEnvironment] = useState(false); // 환경 선택 모달 오픈 값
  const [stateEnvironment, setStateEnvironment] = useState('Local'); // 개발환경 선택 시 해당 값 사용

  // Dropdown 열기/닫기 및 옵션 선택 함수
  const toggleEnvironmentDropdown = () => {
    setShowEnvironment(!isShowEnvironment);
  };

  // Test 환경을 선택할 함수
  const handleEnvironmentOptionClick = (option) => {
    setStateEnvironment(option);
    setShowEnvironment(false);
  };

  const [expandedDetails, setExpandedDetails] = useState({});

  // Detail 버튼 클릭 시 상세 표시 상태를 토글하는 함수
  const toggleDetail = (apiId) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [apiId]: !prev[apiId],
    }));
  };

  // Test 버튼을 클릭하면 진행할 함수
  const handleTest = () => {
    // 임시
  };

  // 복사 이미지 상태 관리
  const [copiedStatus, setCopiedStatus] = useState({});
  const copyApiPath = (docId, path) => {
    navigator.clipboard.writeText(path).then(() => {
      setCopiedStatus((prev) => ({ ...prev, [docId]: true }));
      console.log(path);
      toast('클립보드에 복사되었습니다.');

      setTimeout(() => {
        setCopiedStatus((prev) => ({ ...prev, [docId]: false }));
      }, 1000);
    });
  };

  // ----------------------------------------------------------------------------

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;
  if (!dataTest || dataTest.length === 0) return <div className='p-4'>No data available.</div>;

  return (
    <div className='px-8 py-8 overflow-x-auto overflow-y-auto max-w-[1200px]'>
      <div className='flex justify-between items-baseline mb-4'>
        <h2 className='text-2xl font-bold'>API Test</h2>
      </div>

      {/* 개발환경 설정 및 검색 및 테스트 실행 버튼이 있는 공간 */}
      <div className='flex justify-start mb-4 relative'>
        <button
          className='flex justify-between items-center pr-2 pl-7 w-[120px] h-[40px] bg-[#2D3648] text-white rounded-lg mr-5'
          onClick={toggleEnvironmentDropdown}
        >
          <span className=''>{stateEnvironment}</span>
          {isShowEnvironment ? (
            <RiArrowDropDownLine className='text-2xl' />
          ) : (
            <RiArrowDropUpLine className='text-2xl' />
          )}
        </button>
        {/* 드롭다운 메뉴 */}
        {isShowEnvironment && (
          <div
            className='absolute bg-white border-2 mt-1 rounded shadow-md z-10 text-center'
            style={{ top: '100%', left: '0px', width: '120px' }}
          >
            <ul>
              {['Local', 'Server'].map((option) => (
                <li
                  key={option}
                  onClick={() => handleEnvironmentOptionClick(option)}
                  className='px-4 py-2 cursor-pointer hover:bg-gray-200'
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          className='border-2 p-3 w-[500px] h-[40px] border-[#2D3648] rounded-lg mr-5'
          type='text'
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className='flex justify-center items-center p-3 w-[100px] h-[40px] bg-[#2D3648] rounded-lg text-white hover:bg-[#2D3648]/90'
          onClick={handleTest}
        >
          TEST
        </button>
      </div>

      <div className='overflow-x-auto mx-auto border border-gray-300 rounded-lg'>
        <table className='w-full min-w-[900px] table-fixed' style={{ borderSpacing: 0 }}>
          <thead>
            <tr className='bg-gray-100 h-12'>
              <th className='p-4 text-center font-medium w-[5%]'>
                <input
                  type='checkbox'
                  className='border form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500 text-center'
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className='border p-4 w-[18%] text-center'>Category</th>
              <th className='border p-4 w-[12%] text-center'>API Name</th>
              <th className='border p-4 w-[10%] text-center'>HTTP</th>
              <th className='border p-4 w-[25%] text-center'>API Path</th>
              <th className='border p-4 w-[11%] text-center'>Manager</th>
              <th className='border p-4 w-[7%] text-center'>LS</th>
              <th className='border p-4 w-[7%] text-center'>SS</th>
              <th className='border p-4 w-[10%] text-center'>Detail</th>
            </tr>
          </thead>
          <tbody>
            {dataTest &&
              dataTest.map((api, index) => {
                const isSelected = !!selectedItems[api.apiId];
                const isDetailVisible = expandedDetails[api.apiId]; // 상세 표시 여부 확인
                return (
                  <React.Fragment key={api.apiId || index}>
                    <tr
                      className={`text-[14px] cursor-pointer ${
                        isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className='p-4 text-center border'>
                        <input
                          type='checkbox'
                          className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleCheckboxChange(api.apiId)}
                        />
                      </td>
                      <td
                        className='p-4 border text-center truncate'
                        onClick={() => handleRowClick(api.apiId, api.name)}
                      >
                        {api.category || 'Uncategorized'}
                      </td>
                      <td
                        className='p-4 border text-center truncate'
                        onClick={() => handleRowClick(api.apiId, api.name)}
                      >
                        {api.name || 'Unnamed API'}
                      </td>
                      <td className='p-4 border text-center' onClick={() => handleRowClick(api.apiId, api.name)}>
                        {api.method || 'GET'}
                      </td>
                      <td className='p-4 border relative truncate' onClick={() => handleRowClick(api.apiId, api.name)}>
                        <div className='w-full pr-4 truncate'>
                          {api.path || 'N/A'}
                          {api.path && (
                            <button
                              className='text-xl ml-2 absolute right-3'
                              onClick={(e) => {
                                e.stopPropagation();
                                copyApiPath(api.apiId, api.path);
                              }}
                            >
                              {copiedStatus[api.apiId] ? <IoCopy /> : <IoCopyOutline />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td
                        className='p-4 border text-center truncate'
                        onClick={() => handleRowClick(api.apiId, api.name)}
                      >
                        {api.manager_id || 'N/A'}
                      </td>
                      <td className='p-4 border text-center' onClick={() => handleRowClick(api.apiId, api.name)}>
                        {api.localTest === 'PENDING' ? (
                          <FaTimes className='text-red-600 mx-auto' />
                        ) : (
                          <FaCheck className='text-green-600 mx-auto' />
                        )}
                      </td>
                      <td className='p-4 border text-center' onClick={() => handleRowClick(api.apiId, api.name)}>
                        {api.serverTest === 'PENDING' ? (
                          <FaTimes className='text-red-600 mx-auto' />
                        ) : (
                          <FaCheck className='text-green-600 mx-auto' />
                        )}
                      </td>
                      <td className='p-4 border text-center'>
                        <button
                          className='p-1 text-xl'
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetail(api.apiId); // 상세 표시 상태 토글
                          }}
                        >
                          {isDetailVisible ? <RiDropdownList /> : <RiDropdownList />}
                        </button>
                      </td>
                    </tr>
                    {isDetailVisible && (
                      <tr key={`${api.apiId}-details`}>
                        <td colSpan='9' className='p-4 bg-gray-50'>
                          <div className='flex justify-center items-center w-full gap-4'>
                            {/* Your Response */}
                            <div className='flex flex-col w-full max-w-[500px] space-y-2'>
                              <div className='font-bold text-xl text-left'>My Response</div>
                              <div className='p-5 border border-black rounded-xl h-[500px] bg-white'>
                                Test를 진행해주세요.
                              </div>
                            </div>

                            {/* Server Response */}
                            <div className='flex flex-col w-full max-w-[500px] space-y-2'>
                              <div className='font-bold text-xl text-left'>Mock Response</div>
                              <div className='p-5 border border-black rounded-xl h-[500px] bg-white'>
                                Test를 진행해주세요.
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiTest;
