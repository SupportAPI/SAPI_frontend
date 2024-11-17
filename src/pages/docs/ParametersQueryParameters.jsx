import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';
import { FiChevronDown, FiMinusCircle } from 'react-icons/fi';

const options = ['Required', 'Optional'];

const ParametersQueryParameters = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [queryParameters, setQueryParameters] = useState([]);
  const [currentQueryParameterId, setCurrentQueryParameterId] = useState(() => {
    return localStorage.getItem('currentQueryParameterId') || undefined;
  });
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const queryParameterComponentId = `${apiId}-queryparameter`;

  const queryParameterRefs = useRef({});

  const setQueryParameterRef = (queryParameterId, element) => {
    queryParameterRefs.current[queryParameterId] = element;
  };

  const handleMouseMove = throttle((event, queryParameterId) => {
    const targetElement = queryParameterRefs.current[queryParameterId];
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  const handleRequiredChange = (currentQueryParameter, option) => {
    const updatedQueryParameters = queryParameters.map((queryParameter) =>
      queryParameter.id === currentQueryParameter.id
        ? { ...queryParameter, isRequired: option === 'Required' }
        : queryParameter
    );
    setQueryParameters(updatedQueryParameters);
    handleOccupationState('PARAMETERS_HEADERS', 'UPDATE', {
      componentId: queryParameterComponentId + currentQueryParameter.id,
      isRequired: option === 'Required',
    });
    setIsDropdownOpen(false);
  };

  const handleAddQueryParameter = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'ADD',
      message: {},
    });
  };

  const handleQueryParameterChange = (queryParameterId, type, value) => {
    const updatedQueryParameters = queryParameters.map((queryParameter) =>
      String(queryParameter.id) === String(queryParameterId)
        ? { ...queryParameter, [type.toLowerCase()]: value }
        : queryParameter
    );
    setQueryParameters(updatedQueryParameters);

    const messageValue =
      updatedQueryParameters.find((queryParameter) => String(queryParameter.id) === String(queryParameterId))?.[
        type.toLowerCase()
      ] || value;

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'UPDATE',
      message: {
        id: String(queryParameterId),
        type,
        value: messageValue,
      },
    });
  };

  const handleRemoveQueryParameter = (queryParameterId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'DELETE',
      message: {
        id: queryParameterId,
      },
    });
  };

  const handleOnBlur = (queryParameter) => {
    queryParameter = {
      ...queryParameter,
      componentId: queryParameterComponentId + queryParameter.id,
      isRequired: queryParameter.isRequired,
    };

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'SAVE',
      message: queryParameter,
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentQueryParameterId) {
        localStorage.setItem('currentQueryParameterId', currentQueryParameterId);
      }
      handleOccupationState('OCCUPATION', 'DELETE', {
        componentId: queryParameterComponentId + currentQueryParameterId,
      });
      handleOccupationState('PARAMETERS_QUERY_PARAMETERS', 'SAVE', {
        componentId: queryParameterComponentId + currentQueryParameterId,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQueryParameterId]);

  useEffect(() => {
    const savedQueryParameterId = localStorage.getItem('currentQueryParameterId');
    if (savedQueryParameterId) {
      setCurrentQueryParameterId(savedQueryParameterId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(`[data-query-parameter-id="${isDropdownOpen}"]`) &&
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
    if (apiDocDetail.parameters?.queryParameters) setQueryParameters(apiDocDetail.parameters?.queryParameters || []);
  }, [apiDocDetail.parameters?.queryParameters]);

  return (
    <div className='pt-4'>
      <div className='mb-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[16px] h-8 flex items-center'>Query Parameters</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddQueryParameter}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {queryParameters && (
          <div className=''>
            {queryParameters.length > 0 ? (
              <div className=''>
                <div className='flex h-10 text-[14px] border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                {queryParameters.map((queryParameter, index) => {
                  const queryParameterStatus = checkOccupation(queryParameterComponentId + queryParameter.id);
                  return (
                    <div
                      ref={(el) => setQueryParameterRef(queryParameter.id, el)}
                      key={index}
                      className={`relative flex items-center h-10 text-[14px] border group hover:bg-gray-50 my-1 transition-shadow duration-300`}
                      style={{
                        borderColor: queryParameterStatus.isOccupied ? queryParameterStatus.color : undefined,
                        boxShadow: queryParameterStatus.isOccupied
                          ? `0 0 0 2px ${queryParameterStatus.color}`
                          : undefined,
                      }}
                      onMouseEnter={() => (queryParameterStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onMouseMove={(e) => handleMouseMove(e, queryParameter.id)}
                      onFocus={(e) => {
                        if (queryParameterStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOccupationState('OCCUPATION', 'ADD', {
                          componentId: queryParameterComponentId + queryParameter.id,
                        });
                        setCurrentQueryParameterId(queryParameter.id);
                      }}
                      onBlur={(e) => {
                        if (queryParameterStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOnBlur(queryParameter);
                      }}
                    >
                      <div className='flex-[0.4] h-10 border-r p-2 text-center relative'>
                        <div
                          className={`flex justify-between items-center group-hover:bg-gray-50 ${
                            queryParameterStatus.isOccupiedByOthers && 'pointer-events-none'
                          }`}
                          onClick={() => {
                            if (isDropdownOpen === queryParameter.id) {
                              setIsDropdownOpen(null);
                              return;
                            }
                            setIsDropdownOpen(queryParameter.id);
                            handleOccupationState('OCCUPATION', 'ADD', {
                              componentId: queryParameterComponentId + queryParameter.id,
                            });
                          }}
                          tabIndex={0}
                          data-trigger-id={queryParameter.id}
                        >
                          {queryParameter.isRequired ? 'Required' : 'Optional'}
                          <FiChevronDown />
                        </div>

                        {isDropdownOpen === queryParameter.id && (
                          <div
                            className='absolute left-0 border bg-white mt-2 z-10 w-full'
                            onMouseDown={(e) => e.stopPropagation()}
                            data-query-parameter-id={queryParameter.id}
                          >
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                                onClick={() => {
                                  handleRequiredChange(queryParameter, option);
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
                            queryParameterStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                          value={queryParameter.key}
                          onChange={(e) => handleQueryParameterChange(queryParameter.id, 'KEY', e.target.value)}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Value'
                          value={queryParameter.value}
                          onChange={(e) => handleQueryParameterChange(queryParameter.id, 'VALUE', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            queryParameterStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Description'
                          value={queryParameter.description || ''}
                          onChange={(e) => handleQueryParameterChange(queryParameter.id, 'DESCRIPTION', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50  ${
                            queryParameterStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div
                        className={`w-10 h-10 p-2 cursor-pointer flex justify-center items-center ${
                          queryParameterStatus.isOccupiedByOthers && `pointer-events-none `
                        }`}
                        onClick={() => {
                          handleRemoveQueryParameter(queryParameter.id);
                        }}
                      >
                        <FiMinusCircle />
                      </div>
                      {queryParameterStatus.isOccupiedByOthers && showTooltip && (
                        <div
                          className='fixed w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]'
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                          }}
                        >
                          <div className='flex items-center space-x-2'>
                            <img
                              src={queryParameterStatus.profileImage}
                              alt={queryParameterStatus.nickname}
                              className='w-6 h-6 rounded-full'
                            />
                            <div className='mx-0 text-sm font-medium'>{queryParameterStatus.nickname}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className='flex h-10 text-[14px] border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                <div className='p-2 text-center text-gray-500 border rounded-sm mt-1 h-10'>Is Not QueryParameters</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersQueryParameters;
