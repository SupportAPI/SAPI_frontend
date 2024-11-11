import { useEffect, useState, useRef } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketContext';
import useAuthStore from '../../stores/useAuthStore';
import { FiChevronDown } from 'react-icons/fi';
import Parameters from './Parameters';
import Request from './Request';
import Response from './Response';

const LeftSection = ({ apiDocDetail, categoryList, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { publish } = useWebSocket();
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
  const [category, setCategory] = useState(apiDocDetail.category || {});
  const [name, setName] = useState(apiDocDetail.name || '');
  const [method, setMethod] = useState(apiDocDetail.method || '');
  const [path, setPath] = useState(apiDocDetail.path || '');
  const [description, setDescription] = useState(apiDocDetail.description || '');
  const [filteredCategoryList, setFilteredCategoryList] = useState(categoryList);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);

  const [activeLeftTab, setActiveLeftTab] = useState('parameters');

  // 점유상태에 쓸 아이디들
  const occupationCategoryId = `${apiId}-category`;
  const occupationNameId = `${apiId}-name`;

  const occupationApiPath = `${apiId}-path`;
  const occupationDescription = `${apiId}-description`;

  const pathRef = useRef(null);
  const descriptionRef = useRef(null);

  const categoryRef = useRef(null);
  const nameRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const methodDropdownRef = useRef(null);

  const methodStyles = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-orange-500',
    PATCH: 'text-purple-500',
    DELETE: 'text-red-500',
    HEAD: 'text-gray-500',
    OPTIONS: 'text-yellow-500',
  };

  const openDropdown = () => setShowCategoryDropdown(true);
  const closeDropdown = () => setShowCategoryDropdown(false);

  const handleInputFocus = () => {
    setFilteredCategoryList(categoryList);
    openDropdown();
  };

  // 카테고리에서 새롭게 만들때 (엔터치거나 벗어나면 생성하고 업데이트)
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' && category.name) {
      if (!filteredCategoryList.some((cat) => cat.name === category.name)) {
        publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
          apiType: 'CATEGORY',
          actionType: 'ADD',
          message: { value: category.name },
        });
      } else {
        publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
          apiType: 'CATEGORY',
          actionType: 'UPDATE',
          message: { id: category.categoryId, value: category.name },
        });
      }
      closeDropdown();
    }
  };

  // 카테고리 변경시
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'CATEGORY',
      actionType: 'UPDATE',
      message: { id: cat.categoryId, value: cat.name },
    });
    closeDropdown();
  };

  // 카테고리 변경 시
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory({ name: value });
    const filteredList = categoryList.filter((cat) => cat.name.includes(value));
    setFilteredCategoryList(filteredList);
    openDropdown();
  };

  // 카테고리 삭제하면 서버로 DELETE 보냄 (소켓) 아직 안됨
  const confirmCategoryDelete = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'CATEGORY',
      actionType: 'DELETE',
      message: { id: category.categoryId },
    });
    setShowCategoryDeleteModal(false);
  };

  // 이름 변경하면 서버로 UPDATE 보냄 (소켓)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_NAME',
      actionType: 'UPDATE',
      message: { value: newName },
    });
  };

  // 이름 변경하면 서버로 UPDATE 보냄 (소켓)
  const handlePathChange = (e) => {
    const newPath = e.target.value;
    setPath(newPath);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_PATH',
      actionType: 'UPDATE',
      message: { value: newPath },
    });
  };

  // 이름 변경하면 서버로 UPDATE 보냄 (소켓)
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_DESCRIPTION',
      actionType: 'UPDATE',
      message: { value: newDescription },
    });
  };

  // 마우스 떼면 카테고리 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !showCategoryDeleteModal &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDeleteModal]);

  // 처음 Category 세팅
  useEffect(() => {
    if (apiDocDetail.category) setCategory(apiDocDetail.category);
    if (apiDocDetail.name) setName(apiDocDetail.name);
    if (apiDocDetail.method) setMethod(apiDocDetail.method);
    if (apiDocDetail.path) setPath(apiDocDetail.path);
    if (apiDocDetail.description) setDescription(apiDocDetail.description);
  }, [apiDocDetail]);

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setShowMethodDropdown(false);
  };

  const handleParamsChange = (newParams) => {};

  const handleRequestChange = (newRequest) => {};

  const handleResponseChange = (updatedResponse) => {};

  return (
    <div className='relative flex-1 p-8 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable'>
      <div className='flex items-baseline space-x-2 mb-8 justify-between h-10'>
        <div className='inline-flex items-baseline relative'>
          <input
            type='text'
            ref={categoryRef}
            className={`truncate rounded-md focus:outline-none w-auto max-w-[200px] text-[24px] px-2 focus:shadow-lg 'ring-blue-400' transition-shadow duration-200 h-10`}
            placeholder='Enter Category'
            value={category.name || ''}
            onFocus={() => {
              handleOccupationState(occupationCategoryId, 'ADD');
              handleInputFocus();
            }} // onFocus -> input 클릭시 이벤트
            onBlur={() => handleOccupationState(occupationCategoryId, 'DELETE')} // onBlur -> input 뗄때 이벤트
            onChange={handleCategoryChange}
            onKeyDown={handleCategoryKeyDown}
          />
          &nbsp;
          <input
            type='text'
            ref={nameRef}
            className={`truncate rounded-md focus:outline-none w-auto max-w-[250px] text-[24px] px-2 focus:shadow-lg 'ring-blue-400' transition-shadow duration-200`}
            value={name || ''}
            placeholder='Enter API Name'
            onChange={handleNameChange}
            onFocus={() => handleOccupationState(occupationNameId, 'ADD')}
            onBlur={() => handleOccupationState(occupationNameId, 'DELETE')}
          />
        </div>
        <div className='flex space-x-4'>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaSave />
            <span>Save</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
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

      {showCategoryDropdown && (
        <div
          ref={categoryDropdownRef}
          className='absolute bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto top-10 p-0 mt-8 max-h-[300px] sidebar-scrollbar z-50 w-[200px]'
        >
          {category.name && !filteredCategoryList.some((cat) => cat.name === category.name) && (
            <div
              className='py-2 px-1 flex items-center justify-between cursor-pointer truncate max-w-full text-ellipsis w-full'
              onClick={() => handleCategoryKeyDown({ key: 'Enter' })}
            >
              <span className='truncate block w-full hover:bg-gray-200 rounded-md px-2'>생성: {category.name}</span>
            </div>
          )}
          {filteredCategoryList.map((cat) => (
            <div
              key={cat.categoryId}
              className='py-2 px-1 flex items-center justify-between cursor-pointer truncate max-w-full text-ellipsis w-full'
              onClick={() => handleCategorySelect(cat)}
            >
              <span className='truncate block w-full hover:bg-gray-200 rounded-md px-2'>{cat.name}</span>
              {cat.name !== '미설정' && (
                <button
                  className='text-gray-400 ml-2 hover:bg-gray-200 focus:outline-none rounded-md p-1'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <TiDeleteOutline size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showCategoryDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-xl font-bold mb-4'>카테고리 삭제</h3>
            <p className='mb-6'>선택하신 카테고리를 삭제하시겠습니까?</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={confirmCategoryDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                삭제
              </button>
              <button onClick={() => setShowCategoryDeleteModal(false)} className='px-4 py-2 bg-gray-200 rounded-md'>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API PATH INPUT & PUBLISH & SUBSCRIPTION 해야함  */}
      <div className='mb-4'>
        <label className='block text-[18px] font-semibold mb-2'>API Path</label>
        <div className='relative'>
          <div className='flex items-center space-x-2'>
            <button
              className={`px-4 py-2 w-[150px] rounded-md border ${
                methodStyles[apiDocDetail?.method]
              } border-gray-300 h-10`}
              // onClick={() => setShowDropdown((prev) => !prev)}
            >
              <div className='flex justify-between items-center'>
                <span>{apiDocDetail?.method}</span>
                <FiChevronDown className='ml-2' color='black' />
              </div>
            </button>

            <input
              ref={pathRef}
              type='text'
              className='border rounded px-2 py-1 flex-grow h-10'
              placeholder='Enter URL'
              value={path || ''}
              onChange={handlePathChange}
              onFocus={() => {
                handleOccupationState(occupationApiPath, 'UPDATE');
                handleInputFocus();
              }}
              onBlur={() => handleOccupationState(occupationApiPath, 'DELETE')}
            />
          </div>

          {showMethodDropdown && (
            <div
              ref={methodDropdownRef}
              className='absolute bg-white border mt-1 rounded shadow-md z-10'
              style={{ top: '100%', left: 0, width: '150px' }}
            >
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => (
                <div
                  key={method}
                  className={`p-2 cursor-pointer ${methodStyles[method]} hover:bg-gray-100`}
                  onClick={() => handleMethodSelect(method)}
                >
                  {method}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description INPUT & PUBLISH & SUBSCRIPTION */}
      <div className='mb-4'>
        <label className='block font-semibold mb-2 text-[18px]'>Description</label>
        <textarea
          ref={descriptionRef}
          className='border rounded w-full p-2'
          placeholder='Enter description here.'
          value={description || ''}
          onFocus={() => {
            handleOccupationState(occupationDescription, 'UPDATE');
            handleInputFocus();
          }}
          onChange={handleDescriptionChange}
          onBlur={() => handleOccupationState(occupationDescription, 'DELETE')}
          style={{ resize: 'none' }}
        />
      </div>

      <div className='border-b mb-4'>
        <nav className='flex space-x-4'>
          {['parameters', 'request', 'response'].map((tab) => (
            <a
              key={tab}
              href='#'
              className={`px-2 py-1 ${activeLeftTab === tab ? 'border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </a>
          ))}
        </nav>
      </div>

      <div>
        {activeLeftTab === 'parameters' && (
          <Parameters
            paramsChange={handleParamsChange}
            initialValues={apiDocDetail?.parameters}
            workspaceId={workspaceId}
            apiId={apiId}
          />
        )}
        {activeLeftTab === 'request' && (
          <Request requestChange={handleRequestChange} initialValues={apiDocDetail?.request || {}} />
        )}
        {activeLeftTab === 'response' && (
          <Response responseChange={handleResponseChange} initialValues={apiDocDetail?.response || []} />
        )}
      </div>
    </div>
  );
};

export default LeftSection;
