import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const Response = ({ responseChange, initialValues = { statusCodes: [], responses: {} } }) => {
  const [statusCodes, setStatusCodes] = useState(initialValues.statusCodes || []);
  const [responses, setResponses] = useState(initialValues.responses || {});
  const [selectedCode, setSelectedCode] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    responseChange({
      statusCodes,
      responses,
    });
  }, [statusCodes, responses]);

  // 상태 코드 추가 함수
  const handleAddStatusCode = (code) => {
    if (!statusCodes.includes(code)) {
      const updatedStatusCodes = [...statusCodes, code].sort((a, b) => a - b);
      setStatusCodes(updatedStatusCodes);
      setResponses({ ...responses, [code]: '' });
      setSelectedCode(code);
    }
    setShowDropdown(false);
  };

  // JSON 입력 변경 함수
  const handleJsonChange = (code, value) => {
    setResponses({
      ...responses,
      [code]: value,
    });
  };

  // 상태 코드 삭제 함수
  const handleDeleteStatusCode = (code) => {
    setStatusCodes(statusCodes.filter((status) => status !== code));
    const updatedResponses = { ...responses };
    delete updatedResponses[code];
    setResponses(updatedResponses);
    setSelectedCode(null);
    setShowActions(null);
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.classList.contains('action-button')
    ) {
      setShowDropdown(false);
      setShowActions(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const commonStatusCodes = ['200', '404', '500', '201', '400', '401', '403', '502'];
  const availableStatusCodes = commonStatusCodes.filter((code) => !statusCodes.includes(code)).sort((a, b) => a - b);

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        {/* 상태 코드 목록 */}
        <div className='flex items-center space-x-4'>
          {statusCodes.map((code) => (
            <div key={code} className='relative group'>
              <button
                className={`px-6 py-2 w-[80px] rounded font-semibold cursor-pointer ${
                  selectedCode === code ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => setSelectedCode(code)}
              >
                {code}
                {/* Three dot 버튼 (호버 시에만 표시) */}
                <span
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hidden group-hover:block'
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(showActions === code ? null : code);
                  }}
                >
                  <FiMoreVertical size={16} className='text-white hover:text-gray-300' />
                </span>
              </button>

              {/* Three dot 클릭 시 드롭다운 */}
              {showActions === code && (
                <div className='absolute top-full right-0 bg-white border mt-1 rounded shadow-md z-10'>
                  <div className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleDeleteStatusCode(code)}>
                    Delete
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add 버튼 */}
        <div className='relative'>
          <button onClick={toggleDropdown} className='bg-blue-500 text-white px-4 py-2 rounded w-[100px]'>
            Add <span className='ml-1'>▼</span>
          </button>

          {/* 드롭다운 */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className='absolute right-0 top-full bg-white border mt-1 rounded shadow-md z-10 w-[100px]'
            >
              {availableStatusCodes.map((code) => (
                <div
                  key={code}
                  className='p-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => handleAddStatusCode(code)}
                >
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 선택된 상태 코드에 대한 JSON 입력 필드 */}
      {selectedCode && (
        <div className='mb-6'>
          <h3 className='text-lg font-bold mb-2'>Response JSON for Status Code {selectedCode}</h3>
          <textarea
            className='w-full border rounded p-4 h-40 overflow-y-auto'
            placeholder='Enter JSON response here...'
            value={responses[selectedCode]}
            onChange={(e) => handleJsonChange(selectedCode, e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default Response;
