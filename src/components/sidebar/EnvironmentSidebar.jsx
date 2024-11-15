import { useLocation, useNavigate } from 'react-router-dom';
import {
  useAddEnvironment,
  useFetchEnvironmentList,
  useEditEnvironmentName,
  useDeleteEnvironment,
} from '../../api/queries/useEnvironmentQueries';
import { useTabStore } from '../../stores/useTabStore';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const EnvironmentSidebar = () => {
  const { addTab, confirmTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams();
  const [showInputEnvironment, setShowInputEnvironment] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState({ name: null });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // 선택된 id만 저장
  const [isEditing, setIsEditing] = useState(null); // 현재 편집 중인 id 저장
  const [editName, setEditName] = useState(''); // 편집 중인 이름 저장
  const setRef = useRef(null);
  const deleteRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [addTime, setAddTime] = useState(false);
  const [paths, setPaths] = useState([]);
  const {
    data: envData = null,
    error: envError,
    isLoading: envLoading,
    mutate: addEnvironmentMutation,
  } = useAddEnvironment(workspaceId, newEnvironment.name);

  const { mutate: editEnvironmentName } = useEditEnvironmentName(workspaceId);
  const { mutate: deleteEnvironment } = useDeleteEnvironment(workspaceId);

  const {
    data: environmentList,
    isLoading: isListLoading,
    error: isListError,
    refetch: listRefetch,
  } = useFetchEnvironmentList(workspaceId);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (environmentList) {
      const updatedPaths = environmentList.map((env) => ({
        id: env.id,
        name: env.name,
        path: `/workspace/${workspaceId}/environment/${env.id}`,
      }));

      setPaths(updatedPaths);
    }
  }, [environmentList]);

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
        type: 'dashboard',
      });

      navigate(selectedPath.path);
    }
  };

  const handleDashboardDoubleClick = (id) => {
    confirmTab(id, 'dashboard');
  };

  const handleNameChange = (e) => {
    setNewEnvironment((prev) => ({ ...prev, name: e.target.value }));
  };

  const addEnvironment = () => {
    addEnvironmentMutation({ name: newEnvironment.name }); // mutate 사용
  };

  const handleCategoryOption = (e, categoryId) => {
    e.stopPropagation();
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId)); // 현재 id 토글
  };

  const handleClickOutside = (event) => {
    if (setRef.current && !setRef.current.contains(event.target)) {
      setSelectedCategoryId(null);
    }
    if (deleteRef.current && !deleteRef.current.contains(event.target)) {
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (e, categoryId, currentName) => {
    e.stopPropagation();
    setIsEditing(categoryId); // 편집 중인 id 설정
    setEditName(currentName); // 현재 이름 설정
  };

  // 이름 변경 후 저장 함수
  const handleSaveEdit = (categoryId) => {
    const updatedPaths = paths.map((path) => (path.id === categoryId ? { ...path, name: editName } : path));
    setPaths(updatedPaths);
    editEnvironmentName({ categoryId, name: editName });
    setIsEditing(null); // 편집 모드 종료
    setEditName('');
  };

  const handleBlurSave = (categoryId) => {
    if (isEditing === categoryId) {
      handleSaveEdit(categoryId);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    deleteEnvironment(selectedCategoryId);
    setShowDeleteModal(false);
  };

  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(categoryId);
    }
  };

  useEffect(() => {
    if (envData) {
      const newPath = {
        id: envData.id,
        name: newEnvironment.name,
        path: `/workspace/${workspaceId}/environment/${envData.id}`,
      };
      setPaths((prevPaths) => [...prevPaths, newPath]);
      setShowInputEnvironment(false);
      setNewEnvironment({ name: '' });
      setAddTime(false); // 다음 호출을 위해 리셋
    }
  }, [envData]);

  return (
    <div
      ref={scrollContainerRef}
      className='w-[300px] bg-[#F0F5F8]/50 dark:bg-dark-background dark:text-dark-text h-full border-r flex flex-col text-sm'
    >
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 dark:bg-dark-background z-10'>
        <div className='flex items-center'>
          <FaPlus className='text-gray-600 dark:text-dark-text cursor-pointer mr-2' onClick={handleAddEnvironment} />
          <div className='flex items-center flex-1 bg-white dark:bg-dark-background rounded border relative'>
            <FaSearch className='text-gray-400 dark:text-dark-text ml-2' />
            <input type='text' placeholder='Search' className='p-2 flex-1 bg-transparent outline-none' />
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
        <div className='cursor-pointer text-[#475467] dark:text-dark-text'>
          <ul>
            {paths.map((p) => {
              const isActive = location.pathname === p.path;
              return (
                <li
                  key={p.id}
                  className={`cursor-pointer w-full relative ${
                    isActive ? 'bg-blue-100 text-blue-800 font-semibold dark:bg-dark-hover dark:text-dark-surface' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDashboardClick(p.id);
                  }}
                  onDoubleClick={() => handleDashboardDoubleClick(p.id)}
                >
                  <div className='pl-12 pr-4 py-2 flex items-center justify-between group'>
                    {/* 편집 모드일 때 input, 아닐 때 텍스트 */}
                    {isEditing === p.id ? (
                      <input
                        type='text'
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleBlurSave(p.id)} // 포커스 해제 시 저장
                        onKeyDown={(e) => {
                          handleKeyDown(e, p.id);
                        }}
                        className='bg-white dark:bg-dark-background border-b outline-none'
                      />
                    ) : (
                      <span>{p.name}</span>
                    )}
                    <BsThreeDots
                      className={`text-gray-500 hover:text-gray-700 cursor-pointer opacity-0 group-hover:opacity-100`}
                      onClick={(e) => {
                        handleCategoryOption(e, p.id);
                      }}
                    />
                  </div>
                  {selectedCategoryId === p.id && (
                    <div ref={setRef} className='absolute right-0 w-28 bg-white shadow-lg rounded border z-20'>
                      <button
                        className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                        onClick={(e) => handleEdit(e, p.id, p.name)}
                      >
                        Edit
                      </button>
                      <button
                        className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500 font-normal'
                        onClick={(e) => handleDelete(e, p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
          {showDeleteModal && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
              <div ref={deleteRef} className='bg-white p-6 rounded-lg shadow-lg w-80 dark:bg-dark-background'>
                <h3 className='text-xl font-bold mb-4'>삭제하시겠습니까?</h3>
                <p className='mb-6'>선택한 API 문서를 삭제하시겠습니까?</p>
                <div className='flex justify-end space-x-4'>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-black'
                  >
                    취소
                  </button>
                  <button
                    onClick={(e) => handleConfirmDelete(e)}
                    className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:text-dark-text'
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSidebar;
