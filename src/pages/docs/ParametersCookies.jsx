import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';
import { FiChevronDown, FiMinusCircle } from 'react-icons/fi';

const options = ['Required', 'Optional'];

const ParametersCookies = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [cookies, setCookies] = useState([]);
  const [currentCookieId, setCurrentCookieId] = useState(() => {
    return localStorage.getItem('currentCookieId') || undefined;
  });
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cookieComponentId = `${apiId}-cookie`;

  const cookieRefs = useRef({});

  const setCookieRef = (cookieId, element) => {
    cookieRefs.current[cookieId] = element;
  };

  const handleMouseMove = throttle((event, cookieId) => {
    const targetElement = cookieRefs.current[cookieId];
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  const handleRequiredChange = (currentCookie, option) => {
    const updatedCookies = cookies.map((cookie) =>
      cookie.id === currentCookie.id ? { ...cookie, isRequired: option === 'Required' } : cookie
    );
    setCookies(updatedCookies);
    handleOccupationState('PARAMETERS_HEADERS', 'UPDATE', {
      componentId: cookieComponentId + currentCookie.id,
      isRequired: option === 'Required',
    });
    setIsDropdownOpen(false);
  };

  const handleAddCookie = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_COOKIES',
      actionType: 'ADD',
      message: {},
    });
  };

  const handleCookieChange = (cookieId, type, value) => {
    const updatedCookies = cookies.map((cookie) =>
      String(cookie.id) === String(cookieId) ? { ...cookie, [type.toLowerCase()]: value } : cookie
    );
    setCookies(updatedCookies);

    const messageValue =
      updatedCookies.find((cookie) => String(cookie.id) === String(cookieId))?.[type.toLowerCase()] || value;

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_COOKIES',
      actionType: 'UPDATE',
      message: {
        id: String(cookieId),
        type,
        value: messageValue,
      },
    });
  };

  const handleRemoveQueryParameter = (cookieId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_COOKIES',
      actionType: 'DELETE',
      message: {
        id: cookieId,
      },
    });
  };

  const handleOnBlur = (cookie) => {
    cookie = {
      ...cookie,
      componentId: cookieComponentId + cookie.id,
      isRequired: cookie.isRequired,
    };

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_COOKIES',
      actionType: 'SAVE',
      message: cookie,
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentCookieId) {
        localStorage.setItem('currentCookieId', currentCookieId);
      }
      handleOccupationState('OCCUPATION', 'DELETE', {
        componentId: cookieComponentId + currentCookieId,
      });
      handleOccupationState('PARAMETERS_COOKIES', 'SAVE', {
        componentId: cookieComponentId + currentCookieId,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieComponentId]);

  useEffect(() => {
    const savedCookieId = localStorage.getItem('currentCookieId');
    if (savedCookieId) {
      setCurrentCookieId(savedCookieId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(`[data-cookie-id="${isDropdownOpen}"]`) &&
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

  useEffect(() => {
    if (apiDocDetail.parameters?.cookies) setCookies(apiDocDetail.parameters?.cookies || []);
  }, [apiDocDetail.parameters?.cookies]);

  return (
    <div>
      <div className='mb-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[16px] h-8 flex items-center'>Cookies</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddCookie}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {cookies && (
          <div className=''>
            {cookies.length > 0 ? (
              <div className=''>
                <div className='flex h-10 text-[14px] rounded-sm border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                {cookies.map((cookie, index) => {
                  const cookieStatus = checkOccupation(cookieComponentId + cookie.id);
                  return (
                    <div
                      ref={(el) => setCookieRef(cookie.id, el)}
                      key={index}
                      className={`relative flex items-center rounded-sm h-10 text-[14px] border group hover:bg-gray-50 my-1 transition-shadow duration-300`}
                      style={{
                        borderColor: cookieStatus.isOccupied ? cookieStatus.color : undefined,
                        boxShadow: cookieStatus.isOccupied ? `0 0 0 2px ${cookieStatus.color}` : undefined,
                      }}
                      onMouseEnter={() => (cookieStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onMouseMove={(e) => handleMouseMove(e, cookie.id)}
                      onFocus={(e) => {
                        if (cookieStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOccupationState('OCCUPATION', 'ADD', {
                          componentId: cookieComponentId + cookie.id,
                        });
                        setCurrentCookieId(cookie.id);
                      }}
                      onBlur={(e) => {
                        if (cookieStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOnBlur(cookie);
                      }}
                    >
                      <div className='flex-[0.4] h-10 border-r p-2 text-center relative'>
                        <div
                          className={`flex justify-between cursor-pointer items-center group-hover:bg-gray-50 ${
                            cookieStatus.isOccupiedByOthers && 'pointer-events-none'
                          }`}
                          onClick={() => {
                            if (isDropdownOpen === cookie.id) {
                              setIsDropdownOpen(null);
                              return;
                            }
                            setIsDropdownOpen(cookie.id);
                            handleOccupationState('OCCUPATION', 'ADD', {
                              componentId: cookieComponentId + cookie.id,
                            });
                          }}
                          tabIndex={0}
                          data-trigger-id={cookie.id}
                        >
                          {cookie.isRequired ? 'Required' : 'Optional'}
                          <FiChevronDown />
                        </div>

                        {isDropdownOpen === cookie.id && (
                          <div
                            className='absolute left-0 border bg-white mt-2 z-10 w-full'
                            onMouseDown={(e) => e.stopPropagation()}
                            data-cookie-id={cookie.id}
                          >
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                                onClick={() => {
                                  handleRequiredChange(cookie, option);
                                  setIsDropdownOpen(null);
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Key'
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            cookieStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                          value={cookie.key}
                          onChange={(e) => handleCookieChange(cookie.id, 'KEY', e.target.value)}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Value'
                          value={cookie.value}
                          onChange={(e) => handleCookieChange(cookie.id, 'VALUE', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            cookieStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Description'
                          value={cookie.description}
                          onChange={(e) => handleCookieChange(cookie.id, 'DESCRIPTION', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50  ${
                            cookieStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div
                        className={`w-10 h-10 p-2 cursor-pointer flex justify-center items-center ${
                          cookieStatus.isOccupiedByOthers && `pointer-events-none `
                        }`}
                        onClick={() => {
                          handleRemoveQueryParameter(cookie.id);
                        }}
                      >
                        <FiMinusCircle />
                      </div>
                      {cookieStatus.isOccupiedByOthers && showTooltip && (
                        <div
                          className='fixed w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]'
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                          }}
                        >
                          <div className='flex items-center space-x-2'>
                            <img
                              src={cookieStatus.profileImage}
                              alt={cookieStatus.nickname}
                              className='w-6 h-6 rounded-full'
                            />
                            <div className='mx-0 text-sm font-medium'>{cookieStatus.nickname}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className='flex h-10 text-[14px] rounded-sm border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                <div className='p-2 text-center text-gray-500 border rounded-sm mt-1 h-10'>Is Not Cookies</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersCookies;
