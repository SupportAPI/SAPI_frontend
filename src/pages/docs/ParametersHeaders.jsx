import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';
import { FiChevronDown, FiMinusCircle } from 'react-icons/fi';

const options = ['Required', 'Optional'];

const ParametersHeaders = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [headers, setHeaders] = useState();
  const [currentHeaderId, setCurrentHeaderId] = useState(() => {
    return localStorage.getItem('currentHeaderId') || undefined;
  });
  const [authType, setAuthType] = useState();
  const [authorization, setAuthorization] = useState('');
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const { publish } = useWebSocket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const headerComponentId = `${apiId}-header`;

  const headerRefs = useRef({});

  const setHeaderRef = (headerId, element) => {
    headerRefs.current[headerId] = element;
  };

  const handleMouseMove = throttle((event, headerId) => {
    const targetElement = headerRefs.current[headerId];
    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const absoluteX = targetRect.left + window.scrollX;
      const absoluteY = targetRect.top + window.scrollY;

      const relativeX = event.clientX - targetRect.left;
      const relativeY = event.clientY - targetRect.top;

      setTooltipPosition({
        top: absoluteY + relativeY,
        left: absoluteX + relativeX + 10,
      });
    }
  }, 50);

  const handleRequiredChange = (currentHeader, option) => {
    const updatedHeaders = headers.map((header) =>
      header.id === currentHeader.id ? { ...header, isRequired: option === 'Required' } : header
    );
    setHeaders(updatedHeaders);
    if (option === 'Required') {
      handleHeaderChange(currentHeader.id, 'REQUIRED', true);
    } else if (option === 'Optional') {
      handleHeaderChange(currentHeade2r.id, 'REQUIRED', false);
    }
    setIsDropdownOpen(false);
  };

  const handleAddHeader = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_HEADERS',
      actionType: 'ADD',
      message: {},
    });
  };

  const handleHeaderChange = (headerId, type, value) => {
    const updatedHeaders = headers.map((header) =>
      String(header.id) === String(headerId) ? { ...header, [type.toLowerCase()]: value } : header
    );
    setHeaders(updatedHeaders);

    const messageValue =
      updatedHeaders.find((header) => String(header.id) === String(headerId))?.[type.toLowerCase()] || value;

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_HEADERS',
      actionType: 'UPDATE',
      message: {
        id: String(headerId),
        type,
        value: messageValue,
      },
    });
  };

  const handleRemoveHeader = (headerId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_HEADERS',
      actionType: 'DELETE',
      message: {
        id: headerId,
      },
    });
  };

  useEffect(() => {
    if (apiDocDetail.parameters?.headers) {
      const initialHeaders = apiDocDetail.parameters.headers || [];
      const sortedHeaders = [
        ...initialHeaders.filter((header) => header.key === 'Authorization'),
        ...initialHeaders.filter((header) => header.key !== 'Authorization'),
      ];
      setHeaders(sortedHeaders);
    }

    if (apiDocDetail.parameters?.authType) {
      setAuthType(apiDocDetail.parameters.authType);
      if (apiDocDetail.parameters?.authType === 'NOAUTH') {
        setAuthorization('');
      } else if (apiDocDetail.parameters?.authType === 'BEARER') {
        setAuthorization('Bearer <token>');
      } else if (apiDocDetail.parameters?.authType === 'BASIC') {
        setAuthorization('Basic <credentials>');
      }
    }
  }, [apiDocDetail.parameters?.headers, apiDocDetail.parameters?.authType]);

  const handleOnBlur = (header) => {
    header = { ...header, componentId: headerComponentId + header.id, required: header.isRequired };
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_HEADERS',
      actionType: 'SAVE',
      message: header,
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentHeaderId) {
        localStorage.setItem('currentHeaderId', currentHeaderId);
      }
      handleOccupationState('OCCUPATION', 'DELETE', {
        componentId: headerComponentId + currentHeaderId,
      });
      handleOccupationState('PARAMETERS_HEADERS', 'SAVE', {
        componentId: headerComponentId + currentHeaderId,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHeaderId]);

  useEffect(() => {
    const savedHeaderId = localStorage.getItem('currentHeaderId');
    if (savedHeaderId) {
      setCurrentHeaderId(savedHeaderId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(`[data-header-id="${isDropdownOpen}"]`) &&
        !event.target.closest(`[data-trigger-id="${isDropdownOpen}"]`)
      ) {
        setIsDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div>
      <div className='mb-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[16px] h-8 flex items-center'>Headers</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddHeader}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {headers && (
          <div className=''>
            {headers.length > 0 ? (
              <div className=''>
                <div className='flex h-10 rounded-sm text-[14px] border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                {headers.map((header, index) => {
                  const isAuthorizationHeader = header.key === 'Authorization';
                  const headerStatus = checkOccupation(headerComponentId + header.id);
                  return (
                    <div
                      ref={(el) => setHeaderRef(header.id, el)}
                      key={index}
                      className={`relative flex rounded-sm items-center h-10 text-[14px] border group hover:bg-gray-50 my-1 transition-shadow duration-300`}
                      style={{
                        borderColor: headerStatus.isOccupied ? headerStatus.color : undefined,
                        boxShadow: headerStatus.isOccupied ? `0 0 0 2px ${headerStatus.color}` : undefined,
                      }}
                      onMouseEnter={() => (headerStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onMouseMove={(e) => handleMouseMove(e, header.id)}
                      onFocus={(e) => {
                        if (headerStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOccupationState('OCCUPATION', 'ADD', {
                          componentId: headerComponentId + header.id,
                        });
                        setCurrentHeaderId(header.id);
                      }}
                      onBlur={(e) => {
                        if (headerStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOnBlur(header);
                      }}
                    >
                      <div
                        className={`flex-[0.4] h-10 border-r p-2 text-center relative ${
                          isAuthorizationHeader && `bg-gray-50`
                        }`}
                      >
                        <div
                          className={`flex justify-between cursor-pointer items-center group-hover:bg-gray-50 ${
                            headerStatus.isOccupiedByOthers && 'pointer-events-none'
                          } ${isAuthorizationHeader && 'pointer-events-none bg-gray-50'}`}
                          onClick={() => {
                            if (!isAuthorizationHeader) {
                              if (isDropdownOpen === header.id) {
                                setIsDropdownOpen(null);
                                return;
                              }
                              setIsDropdownOpen(header.id);
                              handleOccupationState('OCCUPATION', 'ADD', {
                                componentId: headerComponentId + header.id,
                              });
                            }
                          }}
                          tabIndex={0}
                          data-trigger-id={header.id}
                        >
                          {header.isRequired ? 'Required' : 'Optional'}
                          {!isAuthorizationHeader && <FiChevronDown />}
                        </div>

                        {isDropdownOpen === header.id && (
                          <div
                            className='absolute left-0 border bg-white mt-2 z-10 w-full'
                            onMouseDown={(e) => e.stopPropagation()}
                            data-header-id={header.id}
                          >
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                                onClick={() => {
                                  handleRequiredChange(header, option);
                                  setIsDropdownOpen(null);
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={`flex-1 h-10 p-2 border-r ${isAuthorizationHeader && `bg-gray-50`}`}>
                        <input
                          type='text'
                          placeholder='Key'
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            isAuthorizationHeader && 'pointer-events-none bg-gray-50'
                          } ${headerStatus.isOccupiedByOthers && `pointer-events-none `}`}
                          value={header.key}
                          onChange={(e) => handleHeaderChange(header.id, 'KEY', e.target.value)}
                        />
                      </div>

                      <div className={`flex-1 h-10 p-2 border-r ${isAuthorizationHeader && `bg-gray-50`}`}>
                        <input
                          type='text'
                          placeholder='Value'
                          value={header.value}
                          onChange={(e) => handleHeaderChange(header.id, 'VALUE', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            isAuthorizationHeader && 'pointer-events-none bg-gray-50'
                          } ${headerStatus.isOccupiedByOthers && `pointer-events-none `}`}
                          readOnly={isAuthorizationHeader}
                          disabled={isAuthorizationHeader}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Description'
                          value={header.description || ''}
                          onChange={(e) => handleHeaderChange(header.id, 'DESCRIPTION', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50  ${
                            headerStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div
                        className={`w-10 h-10 p-2 cursor-pointer flex justify-center items-center ${
                          isAuthorizationHeader && 'cursor-default '
                        } ${headerStatus.isOccupiedByOthers && `pointer-events-none `}`}
                        onClick={() => {
                          if (!isAuthorizationHeader) {
                            handleRemoveHeader(header.id);
                          }
                        }}
                        readOnly={isAuthorizationHeader}
                        disabled={isAuthorizationHeader}
                      >
                        {!isAuthorizationHeader && <FiMinusCircle />}
                      </div>
                      {headerStatus.isOccupiedByOthers && showTooltip && (
                        <div
                          className='fixed w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]'
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                          }}
                        >
                          <div className='flex items-center space-x-2'>
                            <img
                              src={headerStatus.profileImage}
                              alt={headerStatus.nickname}
                              className='w-6 h-6 rounded-full'
                            />
                            <div className='mx-0 text-sm font-medium'>{headerStatus.nickname}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className='flex h-10 text-[14px] border rounded-sm bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                <div className='p-2 text-center text-gray-500 border rounded-sm mt-1 h-10'>Is Not Headers</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersHeaders;
