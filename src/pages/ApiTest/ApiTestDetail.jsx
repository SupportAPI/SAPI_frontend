import { useEffect, useState, useRef } from 'react';
import { useTabStore } from '../../stores/useTabStore';
import { FiChevronDown, FiMessageSquare, FiCode, FiFileText, FiX } from 'react-icons/fi';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt } from 'react-icons/fa';

const ApiTestDetail = () => {
  const { addTab, openTabs, removeTab } = useTabStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState(false);
  const [apiDetail, setApiDetail] = useState({ method: '', path: '', description: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');

  const methodStyles = {
    GET: 'text-green-600',
    POST: 'text-blue-600',
    PUT: 'text-yellow-600',
    PATCH: 'text-purple-600',
    DELETE: 'text-red-600',
    HEAD: 'text-gray-600',
    OPTIONS: 'text-gray-500',
  };

  const handleApiUrlChange = (e) => {
    setApiDetail((prev) => ({ ...prev, path: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setApiDetail((prev) => ({ ...prev, description: e.target.value }));
  };

  const toggleRightTab = (tab) => {
    setActiveRightTab((prevTab) => (prevTab === tab ? false : tab));
  };

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleCloseModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = () => {};

  const handleMethodSelect = (method) => {
    setApiDetail((prev) => ({ ...prev, method }));
    setShowDropdown(false);
  };

  return (
    <div className='flex h-[calc(100vh -104px)]'>
      {/* Sidebar 및 상단 버튼 영역 */}
      <div className='flex-1 p-8 overflow-y-auto sidebar-scrollbar scrollbar-gutter-stable'>
        {/* 입력 필드 및 버튼 */}
        <div className='flex items-baseline space-x-2 mb-8 justify-between'>
          <div className='inline-flex items-baseline space-x-1'>
            <input
              type='text'
              className='border-b focus:outline-none w-auto max-w-[200px] text-[18px] px-2'
              placeholder='Enter Category'
            />
            <span className='text-gray-400' style={{ margin: '0 12px' }}>
              /
            </span>
            <input
              type='text'
              className='text-2xl border-b focus:outline-none w-auto max-w-[250px] px-2 text-[18px]'
              placeholder='Enter API Name'
            />
          </div>
          <div className='flex space-x-4'>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaSave />
              <span>Save</span>
            </button>
            <button
              onClick={handleDeleteClick}
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

        {/* 삭제 모달 */}
        {showDeleteModal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-bold mb-4'>삭제하시겠습니까?</h3>
              <p className='mb-6'>현재 API 문서를 삭제하시겠습니까?</p>
              <div className='flex justify-end space-x-4'>
                <button onClick={handleCloseModal} className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>
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

        {/* API Path and Description */}
        <div className='mb-4'>
          <label className='block text-[18px] font-semibold mb-2'>API Path</label>
          <div className='relative'>
            <button
              className={`px-4 py-2 w-[150px] rounded-md border ${
                methodStyles[apiDetail?.method]
              } border-gray-300 h-10`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <div className='flex justify-between items-center'>
                <span>{apiDetail?.method}</span>
                <FiChevronDown className='ml-2' color='black' />
              </div>
            </button>
            <input
              type='text'
              className='border rounded px-2 py-1 flex-grow h-10'
              placeholder='Enter URL'
              value={apiDetail?.path || ''}
              onChange={handleApiUrlChange}
            />
          </div>
          {showDropdown && (
            <div
              ref={dropdownRef}
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
    </div>
  );
};

export default ApiTestDetail;
