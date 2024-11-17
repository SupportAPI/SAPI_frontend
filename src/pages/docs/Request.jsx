import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';
import { FiChevronDown } from 'react-icons/fi';
import RequestJson from './RequestJson';
import RequestFormData from './RequestFormData';

const options = [
  { value: 'NONE', label: 'none' },
  { value: 'JSON', label: 'json' },
  { value: 'FORM_DATA', label: 'form-data' },
];

const Request = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [bodyType, setBodyType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { publish } = useWebSocket();
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const requestComponentId = `${apiId}-request`;
  const requestStatus = checkOccupation(requestComponentId);
  const requestRef = useRef(null);
  const targetRef = useRef(null);

  const tabComponents = {
    json: RequestJson,
    'form-data': RequestFormData,
  };

  const ActiveTabComponent = tabComponents[bodyType];

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

  const handleAuthTypeChange = (type) => {
    setBodyType(type.label);
    console.log(type);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_TYPE',
      actionType: 'UPDATE',
      message: { value: type.value },
    });

    setIsDropdownOpen(false);
    requestRef.current?.blur();
  };

  useEffect(() => {
    if (apiDocDetail.request?.bodyType) {
      const selectedOption = options.find((option) => option.value === apiDocDetail.request.bodyType);
      setBodyType(selectedOption ? selectedOption.label : '');
    }
  }, [apiDocDetail.request?.bodyType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (requestRef.current && !requestRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className='pt-4'>
      <div className='mb-4'>
        <label className='text-[16px] font-semibold h-8 flex items-center'>Body Type</label>
        <div
          onMouseEnter={() => (requestStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
          onMouseLeave={() => setShowTooltip(false)}
          ref={targetRef}
          onMouseMove={handleMouseMove}
          className='relative w-[250px]'
        >
          <div
            ref={requestRef}
            tabIndex={0}
            className={`w-[250px] text-[14px] flex items-center justify-between focus:outline-none transition duration-300 px-3 py-2 hover:bg-gray-50 relative h-10 border`}
            style={{
              borderColor: requestStatus.isOccupied ? requestStatus.color : undefined,
              boxShadow: requestStatus.isOccupied ? `0 0 0 2px ${requestStatus.color}` : undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (requestStatus.isOccupiedByOthers) {
                return;
              }
              setIsDropdownOpen((prev) => !prev);
              if (!isDropdownOpen) {
                handleOccupationState('OCCUPATION', 'ADD', { componentId: requestComponentId });
              } else {
                handleOccupationState('OCCUPATION', 'DELETE', { componentId: requestComponentId });
              }
            }}
            onBlur={(e) => {
              if (requestStatus.isOccupiedByOthers) {
                e.preventDefault();
                return;
              }
              handleOccupationState('OCCUPATION', 'DELETE', { componentId: requestComponentId });
            }}
          >
            {bodyType}
            <FiChevronDown className='ml-2' color='black' />
          </div>
          {requestStatus.isOccupiedByOthers && showTooltip && (
            <div
              className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left + 10,
              }}
            >
              <div className='flex items-center space-x-2'>
                <img src={requestStatus.profileImage} alt={requestStatus.nickname} className='w-6 h-6 rounded-full' />
                <div className='mx-0 text-sm font-medium'>{requestStatus.nickname}</div>
              </div>
            </div>
          )}
        </div>

        {isDropdownOpen && (
          <div
            className='absolute border w-[250px] text-[14px] bg-white mt-0.5 z-10'
            onMouseDown={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className='px-3 py-2 cursor-pointer hover:bg-gray-50'
                onClick={() => handleAuthTypeChange(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {ActiveTabComponent && (
          <ActiveTabComponent
            apiDocDetail={apiDocDetail}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
        )}
      </div>
    </div>
  );
};

export default Request;
