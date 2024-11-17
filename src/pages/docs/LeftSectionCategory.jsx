import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { throttle } from 'lodash';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { TiDeleteOutline } from 'react-icons/ti';

const LeftSectionCategory = ({
  initialCategory,
  categoryList,
  apiId,
  workspaceId,
  occupationState,
  handleOccupationState,
}) => {
  const [category, setCategory] = useState(initialCategory || {});
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
  const [filteredCategoryList, setFilteredCategoryList] = useState(categoryList);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const categoryRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const targetRef = useRef();
  const { publish } = useWebSocket();
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);

  const categoryComponentId = `${apiId}-category`;
  const categoryStatus = checkOccupation(categoryComponentId);

  // focus
  const handleInputFocus = () => {
    setIsEditing(true);
    setNewCategory('');
    setShowCategoryDropdown(true);
  };

  // input 값 입력
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setNewCategory(value);
    const filteredList = categoryList.filter((cat) => cat.name.includes(value));
    setFilteredCategoryList(filteredList);
    setShowCategoryDropdown(true);
  };

  // input 값 입력하고 enter 클릭시
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      const existingCategory = filteredCategoryList.some((cat) => cat.name === newCategory.trim());
      publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
        apiType: 'CATEGORY',
        actionType: existingCategory ? 'UPDATE' : 'ADD',
        message: existingCategory
          ? { id: category.categoryId, value: newCategory.trim() }
          : { value: newCategory.trim() },
      });
      setCategory({ name: newCategory.trim() });
      setIsEditing(false);
      setNewCategory('');
      setShowCategoryDropdown(false);
      setFilteredCategoryList(sortCategoryList(categoryList));
      categoryRef.current.blur();
    }
  };

  // 마우스클릭
  const handleCategorySelect = (cat) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'CATEGORY',
      actionType: 'UPDATE',
      message: { id: cat.categoryId, value: cat.name },
    });
    setCategory(cat);
    setIsEditing(false);
    setNewCategory('');
    setShowCategoryDropdown(false);
    setFilteredCategoryList(sortCategoryList(categoryList));
    categoryRef.current?.blur();
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setShowCategoryDeleteModal(true);
  };

  // 삭제 확인 모달 취소
  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setShowCategoryDeleteModal(false);
  };

  // 삭제 확인 모달 확인
  const confirmCategoryDelete = () => {
    if (categoryToDelete) {
      publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
        apiType: 'CATEGORY',
        actionType: 'DELETE',
        message: { id: categoryToDelete.categoryId },
      });
      closeDeleteModal();
    }
  };

  // 마우스 위치
  const handleMouseMove = throttle((event) => {
    if (targetRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const relativeX = event.clientX - targetRect.left;
      const relativeY = event.clientY - targetRect.top;

      setTooltipPosition({
        top: relativeY,
        left: relativeX,
      });
    }
  }, 50);

  // 목록 정렬
  const sortCategoryList = (categoryList) => {
    return [...categoryList].sort((a, b) => {
      if (a.name === '미설정') return 1;
      if (b.name === '미설정') return -1;
      return a.name.localeCompare(b.name);
    });
  };

  // 초기 세팅
  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (categoryList) setFilteredCategoryList(sortCategoryList(categoryList));
  }, [initialCategory, categoryList]);

  // 외부 클릭시 드롭다운 없애기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !showCategoryDeleteModal &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDeleteModal]);

  // 모달에서 esc / enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showCategoryDeleteModal) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'Escape') {
          closeDeleteModal();
        }
        if (e.key === 'Enter') {
          confirmCategoryDelete();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCategoryDeleteModal, categoryToDelete]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: categoryComponentId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: categoryComponentId });
    };
  }, []);

  return (
    <>
      <div
        onMouseEnter={() => (categoryStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
        onMouseLeave={() => setShowTooltip(false)}
        ref={targetRef}
        onMouseMove={handleMouseMove}
      >
        <input
          type='text'
          ref={categoryRef}
          className={`truncate rounded-sm border w-auto max-w-[200px] text-[14px] px-3 py-2 h-10
            focus:outline-none transition duration-300
            ${categoryStatus.isOccupiedByOthers ? `pointer-events-none` : ``}
            hover:bg-gray-50`}
          style={{
            borderColor: categoryStatus.isOccupied ? categoryStatus.color : undefined,
            boxShadow: categoryStatus.isOccupied ? `0 0 0 2px ${categoryStatus.color}` : undefined,
          }}
          value={isEditing ? newCategory : category.name || ''}
          placeholder='Enter Category'
          onFocus={(e) => {
            if (categoryStatus.isOccupiedByOthers) {
              e.preventDefault();
              return;
            }
            handleOccupationState('OCCUPATION', 'ADD', { componentId: categoryComponentId });
            handleInputFocus();
          }}
          onBlur={(e) => {
            if (categoryStatus.isOccupiedByOthers) {
              e.preventDefault();
              return;
            }
            handleOccupationState('OCCUPATION', 'DELETE', { componentId: categoryComponentId });
            setIsEditing(false);
          }}
          onChange={(e) => {
            handleCategoryChange(e);
          }}
          onKeyDown={(e) => {
            if (showCategoryDeleteModal) {
              e.preventDefault();
            } else {
              handleCategoryKeyDown(e);
            }
          }}
        />
        {categoryStatus.isOccupiedByOthers && showTooltip && (
          <div
            className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left + 10,
            }}
          >
            <div className='flex items-center space-x-2'>
              <img src={categoryStatus.profileImage} alt={categoryStatus.nickname} className='w-6 h-6 rounded-full' />
              <div className='mx-0 text-sm font-medium'>{categoryStatus.nickname}</div>
            </div>
          </div>
        )}
      </div>

      {showCategoryDropdown && (
        <div
          ref={categoryDropdownRef}
          className='absolute bg-white border border-gray-300 rounded-sm overflow-y-auto top-[42px] p-0  max-h-[300px] sidebar-scrollbar z-50 w-[200px]'
        >
          {newCategory && !filteredCategoryList.some((cat) => cat.name === newCategory) && (
            <div
              className='py-2 px-1 flex items-center justify-between cursor-pointer truncate max-w-full text-ellipsis w-full'
              onClick={() => handleCategoryKeyDown({ key: 'Enter' })}
            >
              <span className='truncate block w-full hover:bg-gray-200 rounded-md px-2'>생성: {newCategory}</span>
            </div>
          )}
          {filteredCategoryList.map((cat) => (
            <div
              key={cat.categoryId}
              className='py-2 px-1 flex items-center justify-between cursor-pointer truncate max-w-full text-ellipsis w-full'
              onClick={(e) => {
                if (categoryStatus.isOccupiedByOthers) {
                  setShowCategoryDropdown(false);
                  e.preventDefault();
                  return;
                }
                handleCategorySelect(cat);
              }}
            >
              <span className='truncate block w-full hover:bg-gray-200 rounded-md px-2'>{cat.name}</span>
              {cat.name !== '미설정' && (
                <button
                  className='text-gray-400 hover:bg-gray-200 focus:outline-none rounded-md p-1'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(cat);
                  }}
                >
                  <TiDeleteOutline size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showCategoryDeleteModal && categoryToDelete && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-xl font-bold mb-4'>카테고리 삭제</h3>
            <p className='mb-6'>선택하신 카테고리를 삭제하시겠습니까?</p>
            <div className='flex justify-end space-x-4'>
              <button
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                onClick={confirmCategoryDelete}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                삭제
              </button>
              <button
                className='px-4 py-2 bg-gray-200 rounded-md'
                onClick={closeDeleteModal}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSectionCategory;
