import { useEffect, useState, useRef } from 'react';

import { FiChevronDown, FiMessageSquare, FiCode, FiFileText, FiX } from 'react-icons/fi';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt, FaInfoCircle, FaHistory } from 'react-icons/fa';

import Parameters from '../docs/Parameters';
import Request from '../docs/Request';
import Response from '../docs/Response';

const HistoryDetail = ({ apiId, closeHistoryDetail }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');
  const [apiDetail, setApiDetail] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const nameRef = useRef(null);

  const methodStyles = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-orange-500',
    PATCH: 'text-purple-500',
    DELETE: 'text-red-500',
    HEAD: 'text-gray-500',
    OPTIONS: 'text-yellow-500',
  };

  const dummyData = {
    id: 19,
    category: {
      value: 'asd1',
    },
    createdDate: '2024-11-07T14:14:46.182551',
    description: 'adasdasdasd',
    docId: '01b1c7c9-c747-49ae-a449-4116f9c4d0a3',
    lastModifyDate: '2024-11-07T14:14:46.180635',
    managerEmail: 'asd',
    managerName: 'asd',
    managerProfileImage: '',
    method: 'GET',
    name: 'asd13',
    parameters: {
      authType: 'BEARER',
      cookies: [],
      headers: [],
      queryParameters: [],
    },
    path: 'asdassd',
    request: {
      bodyType: 'JSON',
      formData: [],
      json: {
        jsonDataDescription: null,
        jsonDataId: '44',
        jsonDataKey: 'json',
        jsonDataType: 'JSON',
        jsonDataValue: '{"whn":"asdasd", "123":"whn", "asdasd":"Qweqwe"}',
      },
    },
    responses: {
      200: [],
    },
  };

  const adjustWidth = (target, ref) => {
    ref.current.style.width = '0px';
    ref.current.style.width = `${target.scrollWidth}px`;
  };

  const handleCategoryChange = (e) => {
    setApiDetail((prev) => ({ ...prev, category: e.target.value }));
    adjustWidth(e.target, categoryRef);
  };

  const handleNameChange = (e) => {
    setApiDetail((prev) => ({ ...prev, name: e.target.value }));
    adjustWidth(e.target, nameRef);
  };

  const handleMethodSelect = (selectedMethod) => {
    setApiDetail((prev) => ({ ...prev, method: selectedMethod }));
    setShowDropdown(false);
  };

  const handleDescriptionChange = (e) => {
    setApiDetail((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleApiUrlChange = (e) => {
    setApiDetail((prev) => ({ ...prev, path: e.target.value }));
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (categoryRef.current) adjustWidth(categoryRef.current, categoryRef);
    if (nameRef.current) adjustWidth(nameRef.current, nameRef);
  }, [dummyData]);

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

  // paramsChange 함수 정의
  const handleParamsChange = (newParams) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      parameters: newParams,
    }));
    console.log('updated', apiDetail?.parameters);
    // console.log('Updated Parameters:', newParams);
  };

  const handleRequestChange = (newRequest) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      request: newRequest,
    }));
    // console.log('Updated Request:', newRequest);
  };

  const handleResponseChange = (updatedResponse) => {
    setApiDetail((prevDetail) => ({
      ...prevDetail,
      response: updatedResponse,
    }));
    // console.log('Updated Response:', updatedResponse);
  };

  return (
    <>
      <button onClick={closeHistoryDetail} className='text-gray-600 hover:text-gray-800'>
        닫기
      </button>
      <h2 className='text-2xl font-bold mb-4'>History Detail - {dummyData.id}</h2>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-baseline space-x-1 mb-8 justify-between'>
          <div className='inline-flex items-baseline space-x-1'>
            <input
              type='text'
              ref={categoryRef}
              className='border-b focus:outline-none w-auto max-w-[200px] text-[18px] px-2'
              placeholder='Enter Category'
              value={dummyData?.category.value || ''}
              readOnly
            />
            <span className='text-gray-400' style={{ margin: '0 12px' }}>
              /
            </span>

            <input
              type='text'
              ref={nameRef}
              className='text-2xl border-b focus:outline-none w-auto max-w-[250px] px-2 text-[18px]'
              value={dummyData?.name || ''}
              readOnly
              placeholder='Enter API Name'
            />
          </div>
        </div>

        {/* API Path and Description */}
        <div className='mb-4'>
          <label className='block text-[18px] font-semibold mb-2'>API Path</label>
          <div className='relative'>
            <div className='flex items-center space-x-2'>
              <button
                className={`px-4 py-2 w-[150px] rounded-md border ${
                  methodStyles[dummyData.method]
                } border-gray-300 h-10`}
              >
                <div className='flex justify-between items-center'>
                  <span>{dummyData.method}</span>
                </div>
              </button>

              <input
                type='text'
                className='border rounded px-2 py-1 flex-grow h-10'
                placeholder='Enter URL'
                value={dummyData.path}
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
          <label className='block font-semibold mb-2 text-[18px]'>Description</label>
          <textarea
            className='border rounded w-full p-2'
            placeholder='No Description.'
            value={dummyData.description}
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
          {activeLeftTab === 'parameters' && (
            <Parameters paramsChange={handleParamsChange} initialValues={dummyData.parameters} />
          )}
          {activeLeftTab === 'request' && (
            <Request requestChange={handleRequestChange} initialValues={dummyData.request} />
          )}
          {activeLeftTab === 'response' && (
            <Response responseChange={handleResponseChange} initialValues={dummyData.responses[200]} />
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryDetail;
