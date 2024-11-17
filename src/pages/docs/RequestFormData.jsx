import { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';
import { FiChevronDown, FiMinusCircle } from 'react-icons/fi';

const options = ['Required', 'Optional'];

const RequestFormData = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [bodyType, setRequestType] = useState();
  const [formDatas, setFormDatas] = useState({});
  const [currentFormDataId, setCurrentFormDataId] = useState(() => {
    return localStorage.getItem('currentFormDataId') || undefined;
  });
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isRequiredDropDown, setIsRequiredDropDown] = useState(false);
  const [isTypeDropDown, setIsTypeDropDown] = useState(false);

  const formDataComponentId = `${apiId}-formData`;
  const formDataRefs = useRef({});

  const setFormDataRef = (formDataId, element) => {
    formDataRefs.current[formDataId] = element;
  };

  const handleMouseMove = throttle((event, formDataId) => {
    const targetElement = formDataRefs.current[formDataId];
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  const handleRequiredChange = (currentFormDataId, option) => {
    const updatedFormDatas = formDatas.map((formData) =>
      formData.id === currentFormDataId.id ? { ...formData, isRequired: option === 'Required' } : formData
    );
    setFormDatas(updatedFormDatas);
    handleOccupationState('REQUEST_FORM_DATA', 'UPDATE', {
      componentId: formDataComponentId + currentFormDataId.id,
      isRequired: option === 'Required',
    });
    setIsRequiredDropDown(false);
  };

  const handleTypeChange = (currentFormDataId, option) => {
    const updatedFormDatas = formDatas.map((formData) =>
      formData.id === currentFormDataId.id ? { ...formData, type: option } : formData
    );
    setFormDatas(updatedFormDatas);
    handleOccupationState('REQUEST_FORM_DATA', 'UPDATE', {
      componentId: formDataComponentId + currentFormDataId.id,
      type: option,
    });
    setIsRequiredDropDown(false);
  };

  const handleAddFormData = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_FORM_DATA',
      actionType: 'ADD',
      message: {},
    });
  };

  const handleFormDataChange = (formDataId, type, value) => {
    const updatedFormDatas = formDatas.map((formData) =>
      String(formData.id) === String(formDataId) ? { ...formData, [type.toLowerCase()]: value } : formData
    );
    setFormDatas(updatedFormDatas);

    const messageValue =
      updatedFormDatas.find((formData) => String(formData.id) === String(formDataId))?.[type.toLowerCase()] || value;

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_FORM_DATA',
      actionType: 'UPDATE',
      message: {
        id: String(formDataId),
        type,
        value: messageValue,
      },
    });
  };

  const handleRemoveFormData = (formDataId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_FORM_DATA',
      actionType: 'DELETE',
      message: {
        id: formDataId,
      },
    });
  };

  const handleOnBlur = (formData) => {
    formData = {
      ...formData,
      componentId: formDataComponentId + formData.id,
      isRequired: formData.isRequired,
    };

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_FORM_DATA',
      actionType: 'SAVE',
      message: formData,
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentFormDataId) {
        localStorage.setItem('currentFormDataId', currentFormDataId);
      }
      handleOccupationState('OCCUPATION', 'DELETE', {
        componentId: formDataComponentId + currentFormDataId,
      });
      handleOccupationState('REQUEST_FORM_DATA', 'SAVE', {
        componentId: formDataComponentId + currentFormDataId,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormDataId]);

  useEffect(() => {
    const savedFormDataId = localStorage.getItem('currentFormDataId');
    if (savedFormDataId) {
      setCurrentFormDataId(savedFormDataId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isRequiredDropDown &&
        !event.target.closest(`[data-form-data-id="${isRequiredDropDown}"]`) &&
        !event.target.closest(`[data-trigger-id="${isRequiredDropDown}"]`)
      ) {
        setIsRequiredDropDown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRequiredDropDown]);

  useEffect(() => {
    if (apiDocDetail.request?.formData) setFormDatas(apiDocDetail.request?.formData || []);
  }, [apiDocDetail.request?.formData]);

  return (
    <div className='pt-4'>
      <div className='mb-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[16px] h-8 flex items-center'>Form Data</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddFormData}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {formDatas && (
          <div className=''>
            {formDatas.length > 0 ? (
              <div className=''>
                <div className='flex h-10 text-[14px] border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                  <div className='w-10 p-2 h-10 text-center'></div>
                </div>
                {formDatas.map((formData, index) => {
                  const formDataStatus = checkOccupation(formDataComponentId + formData.id);
                  return (
                    <div
                      ref={(el) => setFormDataRef(formData.id, el)}
                      key={index}
                      className={`relative flex items-center h-10 text-[14px] border group hover:bg-gray-50 my-1 transition-shadow duration-300`}
                      style={{
                        borderColor: formDataStatus.isOccupied ? formDataStatus.color : undefined,
                        boxShadow: formDataStatus.isOccupied ? `0 0 0 2px ${formDataStatus.color}` : undefined,
                      }}
                      onMouseEnter={() => (formDataStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onMouseMove={(e) => handleMouseMove(e, formData.id)}
                      onFocus={(e) => {
                        if (formDataStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOccupationState('OCCUPATION', 'ADD', {
                          componentId: formDataComponentId + formData.id,
                        });
                        setCurrentFormDataId(formData.id);
                      }}
                      onBlur={(e) => {
                        if (formDataStatus.isOccupiedByOthers) {
                          e.preventDefault();
                          return;
                        }
                        handleOnBlur(formData);
                      }}
                    >
                      <div className='flex-[0.4] h-10 border-r p-2 text-center relative'>
                        <div
                          className={`flex justify-between items-center group-hover:bg-gray-50 ${
                            formDataStatus.isOccupiedByOthers && 'pointer-events-none'
                          }`}
                          onClick={() => {
                            if (isRequiredDropDown === formData.id) {
                              setIsRequiredDropDown(null);
                              return;
                            }
                            setIsRequiredDropDown(formData.id);
                            handleOccupationState('OCCUPATION', 'ADD', {
                              componentId: formDataComponentId + formData.id,
                            });
                          }}
                          tabIndex={0}
                          data-trigger-id={formData.id}
                        >
                          {formData.isRequired ? 'Required' : 'Optional'}
                          <FiChevronDown />
                        </div>

                        {isRequiredDropDown === formData.id && (
                          <div
                            className='absolute left-0 border bg-white mt-2 z-10 w-full'
                            onMouseDown={(e) => e.stopPropagation()}
                            data-form-data-id={formData.id}
                          >
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                                onClick={() => {
                                  handleRequiredChange(formData, option);
                                  setIsRequiredDropDown(null);
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className='relative flex flex-1 h-10 p-2 border-r justify-between'>
                        <input
                          type='text'
                          placeholder='Key'
                          className={`w-[calc(100%-75px)] border-none outline-none group-hover:bg-gray-50 ${
                            formDataStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                          value={formData.key}
                          onChange={(e) => handleFormDataChange(formData.id, 'KEY', e.target.value)}
                        />
                        <div className='w-[1px] bg-gray-300 h-full mx-1'></div>
                        <div
                          className={`flex w-[75px] p-1  justify-between items-center group-hover:bg-gray-50 ${
                            formDataStatus.isOccupiedByOthers && 'pointer-events-none'
                          }`}
                          onClick={() => {
                            if (isTypeDropDown === formData.id) {
                              setIsTypeDropDown(null);
                              return;
                            }
                            setIsTypeDropDown(formData.id);
                            handleOccupationState('OCCUPATION', 'ADD', {
                              componentId: formDataComponentId + formData.id,
                            });
                          }}
                          tabIndex={0}
                          data-trigger-id={formData.id}
                        >
                          {formData.type}
                          <FiChevronDown />
                        </div>

                        {isTypeDropDown === formData.id && (
                          <div
                            className='absolute w-[75px] border right-2 bg-white mt-7 z-10'
                            onMouseDown={(e) => e.stopPropagation()}
                            data-form-data-id={formData.id}
                          >
                            {['TEXT', 'FILE'].map((option, index) => (
                              <div
                                key={index}
                                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                                onClick={() => {
                                  handleTypeChange(formData, option);
                                  setIsTypeDropDown(null);
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
                          placeholder='Value'
                          value={formData.value}
                          onChange={(e) => handleFormDataChange(formData.id, 'VALUE', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50 ${
                            formDataStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div className='flex-1 h-10 p-2 border-r'>
                        <input
                          type='text'
                          placeholder='Description'
                          value={formData.description || ''}
                          onChange={(e) => handleFormDataChange(formData.id, 'DESCRIPTION', e.target.value)}
                          className={`w-full border-none outline-none group-hover:bg-gray-50  ${
                            formDataStatus.isOccupiedByOthers && `pointer-events-none `
                          }`}
                        />
                      </div>

                      <div
                        className={`w-10 h-10 p-2 cursor-pointer flex justify-center items-center ${
                          formDataStatus.isOccupiedByOthers && `pointer-events-none `
                        }`}
                        onClick={() => {
                          handleRemoveFormData(formData.id);
                        }}
                      >
                        <FiMinusCircle />
                      </div>
                      {formDataStatus.isOccupiedByOthers && showTooltip && (
                        <div
                          className='fixed w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]'
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                          }}
                        >
                          <div className='flex items-center space-x-2'>
                            <img
                              src={formDataStatus.profileImage}
                              alt={formDataStatus.nickname}
                              className='w-6 h-6 rounded-full'
                            />
                            <div className='mx-0 text-sm font-medium'>{formDataStatus.nickname}</div>
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
                <div className='p-2 text-center text-gray-500 border rounded-sm mt-1 h-10'>No form-data availiable</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestFormData;
