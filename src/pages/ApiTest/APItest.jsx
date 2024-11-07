import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDetailApiDocs, useDeleteApiDoc, useCreateApiDoc } from '../../api/queries/useApiDocsQueries';
import { useNavbarStore } from '../../stores/useNavbarStore';
import { useTabStore } from '../../stores/useTabStore';
import { FaCheck, FaTimes, FaTrashAlt, FaPlus, FaShareAlt, FaDownload } from 'react-icons/fa';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { RiDropdownList } from 'react-icons/ri';
import { toast } from 'react-toastify';

const ApiTest = () => {
  const { data = [], isLoading, error } = useDetailApiDocs();
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setMenu } = useNavbarStore();
  const { addTab, openTabs } = useTabStore();

  const { mutate: deleteApiDoc } = useDeleteApiDoc();
  const { mutate: createApiDoc } = useCreateApiDoc();

  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspaceId}/apidocs/all`) {
      setMenu('API Docs');
      const existingTab = openTabs.find((tab) => tab.path === location.pathname);
      if (!existingTab) {
        addTab({
          id: 'all',
          name: 'API Overview',
          path: location.pathname,
        });
      }
    }
  }, [location, workspaceId, setMenu, addTab, openTabs]);

  useEffect(() => {
    const allSelected = data.every((api) => selectedItems[api.docId]);
    setIsAllSelected(allSelected);
  }, [selectedItems, data]);

  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newSelectedItems = {};
    data.forEach((api) => {
      newSelectedItems[api.docId] = newSelectedState;
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

  const handleRowClick = (apiId) => {
    navigate(`/workspace/${workspaceId}/api-test/${apiId}`);
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    Object.keys(selectedItems).forEach((apiId) => {
      if (selectedItems[apiId]) {
        deleteApiDoc({ workspaceId, apiId });
      }
    });
    setSelectedItems({});
    setShowDeleteModal(false);
  };

  const handleAddApiDoc = () => {
    if (workspaceId) {
      createApiDoc(workspaceId);
    }
  };

  // -------------------------------------------------------여기서 부터 작성함
  /* 주요 변경 사항!
    1. 각 목록을 선택하는 기준을 각 tr에서 td로 바꿨음 -> Category에서 SS까지 적용됨
  */

  // 검색 필터 상태 관리
  const [search, setSearch] = useState(''); // 아래 테이블을 검색할 값 onChange로 엮여있음
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

  // 상세 표시 상태를 각 항목별로 관리하기 위해 객체 형태로 초기화
  const [expandedDetails, setExpandedDetails] = useState({});

  // Detail 버튼 클릭 시 상세 표시 상태를 토글하는 함수
  const toggleDetail = (apiId) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [apiId]: !prev[apiId], // 기존 상태를 토글
    }));
  };

  // Test 버튼을 클릭하면 진행할 함수
  const handleTest = () => {
    // 임시
  };

  // 복사 이미지 상태 관리
  const [copiedStatus, setCopiedStatus] = useState({});
  // API 주소를 복사할 수 있는 함수
  const copyApiPath = (docId, path) => {
    path = 'Path'; // 일단 임시로 설정
    path = `안녕 난 ${docId} 번의 ${path} 야`;
    // 실제 복사 동작 (예: 클립보드 복사)
    navigator.clipboard.writeText(path).then(() => {
      // 복사 상태를 현재 docId에 대해 true로 설정
      setCopiedStatus((prev) => ({ ...prev, [docId]: true }));
      console.log(path);
      toast('클립보드에 복사되었습니다.');

      // 2초 후에 현재 docId의 복사 상태를 false로 되돌림
      setTimeout(() => {
        setCopiedStatus((prev) => ({ ...prev, [docId]: false }));
      }, 1000);
    });
  };

  // ----------------------------------------------------------------------------

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4'>Failed to load data.</div>;

  return (
    <div className='px-8 py-8 overflow-x-auto overflow-y-auto'>
      <div className='flex justify-between items-baseline mb-4'>
        <h2 className='text-2xl font-bold'>API Test</h2>
        <div className='flex space-x-4'>
          <button
            onClick={handleAddApiDoc}
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
          >
            <FaPlus />
            <span>Add</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
          >
            <FaTrashAlt />
            <span>Delete</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaDownload />
            <span>Export</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
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

      {/* 모달 */}
      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-xl font-bold mb-4'>삭제하시겠습니까?</h3>
            <p className='mb-6'>선택한 API 문서를 삭제하시겠습니까?</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='overflow-x-auto mx-auto border border-gray-300 rounded-lg'>
        <table className='w-full min-w-[1200px] table-fixed' style={{ borderSpacing: 0 }}>
          <thead>
            <tr className='bg-gray-100 h-12'>
              <th className='p-4 text-center font-medium w-[5%]'>
                <input
                  type='checkbox'
                  className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className='p-4 text-left font-medium w-[10%]'>Category</th>
              <th className='p-4 text-left font-medium w-[20%]'>API Name</th>
              <th className='p-4 text-left font-medium w-[10%]'>HTTP</th>
              <th className='p-4 text-left font-medium w-[25%]'>API Path</th>
              <th className='p-4 text-center font-medium w-[15%]'>Manager</th>
              <th className='p-4 text-center font-medium w-[5%]'>LS</th>
              <th className='p-4 text-center font-medium w-[5%]'>SS</th>
              <th className='p-4 text-center font-medium w-[10%]'>Detail</th>
            </tr>
          </thead>
          <tbody>
            {data.map((api) => {
              const isSelected = !!selectedItems[api.docId];
              const isDetailVisible = expandedDetails[api.docId]; // 상세 표시 여부 확인
              return (
                <>
                  <tr
                    key={api.docId}
                    className={`text-[14px] cursor-pointer ${
                      isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className='p-4 text-center'>
                      <input
                        type='checkbox'
                        className='form-checkbox w-4 h-4 align-middle text-indigo-600 focus:ring-indigo-500'
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleCheckboxChange(api.docId)}
                      />
                    </td>
                    <td className='p-4' onClick={() => handleRowClick(api.docId)}>
                      {api.category || 'Uncategorized'}
                    </td>
                    <td className='p-4' onClick={() => handleRowClick(api.docId)}>
                      {api.name || 'Unnamed API'}
                    </td>
                    <td className='p-4' onClick={() => handleRowClick(api.docId)}>
                      {api.method || 'GET'}
                    </td>
                    <td className='p-4 flex justify-between items-center' onClick={() => handleRowClick(api.docId)}>
                      {api.path || `/api/${api.name.toLowerCase().replace(/\s+/g, '-')}`}
                      <button
                        className='text-xl ml-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          copyApiPath(api.docId, api.path);
                        }}
                      >
                        {copiedStatus[api.docId] ? <IoCopy /> : <IoCopyOutline />}
                      </button>
                    </td>
                    <td className='p-4 text-center' onClick={() => handleRowClick(api.docId)}>
                      {api.manager_id || 'N/A'}
                    </td>
                    <td className='p-4 text-center' onClick={() => handleRowClick(api.docId)}>
                      {api.localStatus === 'PENDING' ? (
                        <FaTimes className='text-red-600 mx-auto' />
                      ) : (
                        <FaCheck className='text-green-600 mx-auto' />
                      )}
                    </td>
                    <td className='p-4 text-center' onClick={() => handleRowClick(api.docId)}>
                      {api.serverStatus === 'PENDING' ? (
                        <FaTimes className='text-red-600 mx-auto' />
                      ) : (
                        <FaCheck className='text-green-600 mx-auto' />
                      )}
                    </td>
                    <td className='p-4 text-center'>
                      <button
                        className='p-1 text-xl'
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetail(api.docId); // 상세 표시 상태 토글
                        }}
                      >
                        {isDetailVisible ? <RiDropdownList /> : <RiDropdownList />}
                      </button>
                    </td>
                  </tr>
                  {isDetailVisible && (
                    <tr>
                      <td colSpan='9' className='p-4 bg-gray-50'>
                        <div className='flex flex-wrap lg:justify-center justify-start items-center w-full gap-4 lg:gap-10'>
                          {/* Your Response */}
                          <div className='flex flex-col w-full max-w-[600px] space-y-2'>
                            <div className='font-bold text-xl text-left'>Your Response</div>
                            <div className='p-5 border border-black rounded-xl h-[500px] bg-white'>
                              내용을 넣어주세요
                            </div>
                          </div>

                          {/* Server Response */}
                          <div className='flex flex-col w-full max-w-[600px] space-y-2'>
                            <div className='font-bold text-xl text-left'>Server Response</div>
                            <div className='p-5 border border-black rounded-xl h-[500px] bg-white'>
                              내용을 넣어주세요
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiTest;
