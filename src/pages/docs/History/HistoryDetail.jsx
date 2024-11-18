import { useEffect, useState, useRef } from 'react';
import { PiArrowFatLeftFill } from 'react-icons/pi';
import { FaReply, FaUndo, FaUndoAlt } from 'react-icons/fa';
import { MdHistory } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa6';
HistoryParameters;
import { useFetchApiHistoryDetail } from '../../../api/queries/useApiHistory';
import { useParams } from 'react-router';
import HistoryParameters from './HistoryParameters';
import HistoryRequest from './HistoryRequest';
import HistoryResponse from './HistoryResponse';

const HistoryDetail = ({ apiId, closeHistoryDetail }) => {
  const { workspaceId } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');
  const [apiDetail, setApiDetail] = useState(null);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const nameRef = useRef(null);

  const {
    data: historyData = null,
    isLoading: isHistoryLoading = false,
    error: isDataError = null,
    refetch: historyRefetch,
  } = apiId ? useFetchApiHistoryDetail(workspaceId, apiId) : {};

  useEffect(() => {
    historyRefetch();
  }, [apiId]);

  const methodStyles = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-orange-500',
    PATCH: 'text-purple-500',
    DELETE: 'text-red-500',
    HEAD: 'text-gray-500',
    OPTIONS: 'text-yellow-500',
  };

  console.log('historyData', historyData);

  const adjustWidth = (ref) => {
    if (ref?.current) {
      ref.current.style.width = 'auto'; // 먼저 초기화
      ref.current.style.width = `${ref.current.scrollWidth + 5}px`; // 내용에 맞게 너비 설정
    }
  };

  const handleCategoryChange = (e) => {
    setApiDetail((prev) => ({ ...prev, category: e.target.value }));
    adjustWidth(categoryRef); // target 제거
  };

  const handleNameChange = (e) => {
    setApiDetail((prev) => ({ ...prev, name: e.target.value }));
    adjustWidth(nameRef); // target 제거
  };

  useEffect(() => {
    if (categoryRef.current) adjustWidth(categoryRef);
    if (nameRef.current) adjustWidth(nameRef);
  }, [historyData]); // historyData 변경 시 너비 조정

  // const handleMethodSelect = (selectedMethod) => {
  //   setApiDetail((prev) => ({ ...prev, method: selectedMethod }));
  //   setShowDropdown(false);
  // };

  // const handleDescriptionChange = (e) => {
  //   setApiDetail((prev) => ({ ...prev, description: e.target.value }));
  // };

  // const handleApiUrlChange = (e) => {
  //   setApiDetail((prev) => ({ ...prev, path: e.target.value }));
  // };

  // const handleDeleteClick = () => {
  //   setShowDeleteModal(true);
  // };

  useEffect(() => {
    if (categoryRef.current) adjustWidth(categoryRef);
    if (nameRef.current) adjustWidth(nameRef);
  }, [historyData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className='flex-1 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable p-6'>
      <div className='flex flex-row mt-3'>
        <FaArrowLeft onClick={closeHistoryDetail} className='text-black hover:text-[#4C5E65] mt-1' size={28} />
        <h2 className='text-2xl font-bold mb-4 ml-3'>History Detail - {apiId}</h2>
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-baseline space-x-2 justify-between'>
          <div className='inline-flex items-baseline space-x-1'>
            <label className='flex items-center text-[16px] font-semibold h-8'>Category & Name</label>
          </div>
        </div>
        <div className='flex flex-row items-center mb-3'>
          <p
            ref={categoryRef}
            className='focus:outline-none text-[14px] px-2 inline-block'
            style={{ width: 'fit-content', minWidth: '0' }}
          >
            {historyData?.category?.name || ''}
          </p>
          <span className='text-gray-400 mx-3'>/</span>
          <input
            type='text'
            ref={nameRef}
            className='focus:outline-none w-auto text-[14px] px-2'
            value={historyData?.name || ''}
            readOnly
            placeholder='Enter API Name'
            style={{ width: 'fit-content' }}
          />
        </div>
        {/* API Path and Description */}
        <div className='mb-4'>
          <label className='flex items-center text-[16px] font-semibold h-8'>API Path</label>
          <div className='relative'>
            <div className='flex items-center space-x-2'>
              <button
                disabled
                className={`px-4 py-2 w-[150px] rounded-md border ${
                  methodStyles[historyData?.method]
                } border-gray-300 h-10`}
              >
                <div className='flex justify-between items-center'>
                  <span>{historyData?.method}</span>
                </div>
              </button>

              <input
                type='text'
                className='border rounded px-2 py-1 flex-grow h-10'
                placeholder='No URL'
                value={historyData?.path}
                readOnly
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
        <div className='mb-4'>
          <label className='flex items-center text-[16px] font-semibold h-8'>Description</label>
          <textarea
            className='border rounded w-full p-2'
            placeholder='No Description.'
            value={historyData?.description}
            readOnly
            style={{ resize: 'none' }}
          />
        </div>
        {/* Left Tabs for Parameters, Request, Response */}
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
          {activeLeftTab === 'parameters' && historyData?.parameters && (
            <HistoryParameters initialValues={historyData.parameters} />
          )}
          {activeLeftTab === 'request' && historyData?.request && (
            <HistoryRequest initialValues={historyData.request} />
          )}
          {activeLeftTab === 'response' && historyData?.response && <HistoryResponse response={historyData.response} />}
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
