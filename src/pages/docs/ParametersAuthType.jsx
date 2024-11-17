import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';
import { FiChevronDown } from 'react-icons/fi';

const options = [
  { value: 'NOAUTH', label: 'No Auth' },
  { value: 'BEARER', label: 'Bearer Token' },
  { value: 'BASIC', label: 'Basic Auth' },
];

const ParametersAuthType = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [authType, setAuthType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const authTypeRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [id, setId] = useState();

  const authTypeComponentId = `${apiId}-authType`;
  const authTypeStatus = checkOccupation(authTypeComponentId);
  const targetRef = useRef(null);

  const handleAuthTypeChange = (type) => {
    setAuthType(type);

    if (type.value === 'NOAUTH') {
      if (id) {
        publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
          apiType: 'PARAMETERS_HEADERS',
          actionType: 'DELETE',
          message: { id: id },
        });
      }
    } else if (type.value === 'BEARER') {
      if (id) {
        publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
          apiType: 'PARAMETERS_HEADERS',
          actionType: 'DELETE',
          message: { id: id },
        });
      }
      publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
        apiType: 'PARAMETERS_HEADERS',
        actionType: 'ADD',
        message: { required: true, key: 'Authorization', value: 'Bearer <token>' },
      });
    } else if (type.value === 'BASIC') {
      if (id) {
        publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
          apiType: 'PARAMETERS_HEADERS',
          actionType: 'DELETE',
          message: { id: id },
        });
      }
      publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
        apiType: 'PARAMETERS_HEADERS',
        actionType: 'ADD',
        message: { required: true, key: 'Authorization', value: 'Basic <credentials>' },
      });
    }
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_AUTH_TYPE',
      actionType: 'UPDATE',
      message: { value: type.value },
    });

    setIsDropdownOpen(false);
    authTypeRef.current?.blur();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authTypeRef.current && !authTypeRef.current.contains(event.target)) {
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

  useEffect(() => {
    if (apiDocDetail.parameters?.authType) {
      const initialAuthType = options.find((option) => option.value === apiDocDetail.parameters?.authType);
      setAuthType(initialAuthType || null);
    }
  }, [apiDocDetail.parameters?.authType]);

  useEffect(() => {
    if (apiDocDetail.parameters?.headers) {
      const header = apiDocDetail.parameters.headers.find((header) => header.key === 'Authorization');
      if (header) {
        setId(header.id);
      }
    }
  }, [apiDocDetail.parameters?.headers]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: authTypeComponentId });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: authTypeComponentId });
    };
  }, []);

  return (
    <div className='pt-4'>
      <div className='mb-4'>
        <label className='flex items-center text-[16px] font-semibold h-8'>Auth Type</label>
        <div
          onMouseEnter={() => (authTypeStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
          onMouseLeave={() => setShowTooltip(false)}
          ref={targetRef}
          onMouseMove={handleMouseMove}
          className='relative w-[250px]'
        >
          <div
            ref={authTypeRef}
            className={`w-[250px] text-[14px] flex items-center justify-between focus:outline-none transition duration-300 px-3 py-2 hover:bg-gray-50 relative h-10 border`}
            style={{
              borderColor: authTypeStatus.isOccupied ? authTypeStatus.color : undefined,
              boxShadow: authTypeStatus.isOccupied ? `0 0 0 2px ${authTypeStatus.color}` : undefined,
            }}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              if (authTypeStatus.isOccupiedByOthers) {
                return;
              }
              setIsDropdownOpen((prev) => !prev);
              if (!isDropdownOpen) {
                handleOccupationState('OCCUPATION', 'ADD', { componentId: authTypeComponentId });
              } else {
                handleOccupationState('OCCUPATION', 'DELETE', { componentId: authTypeComponentId });
              }
            }}
            onBlur={(e) => {
              if (authTypeStatus.isOccupiedByOthers) {
                e.preventDefault();
                return;
              }
              handleOccupationState('OCCUPATION', 'DELETE', { componentId: authTypeComponentId });
            }}
          >
            {authType ? authType.label : 'Select Auth Type'}
            <FiChevronDown className='ml-2' color='black' />
          </div>
          {authTypeStatus.isOccupiedByOthers && showTooltip && (
            <div
              className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left + 10,
              }}
            >
              <div className='flex items-center space-x-2'>
                <img src={authTypeStatus.profileImage} alt={authTypeStatus.nickname} className='w-6 h-6 rounded-full' />
                <div className='mx-0 text-sm font-medium'>{authTypeStatus.nickname}</div>
              </div>
            </div>
          )}
        </div>

        {isDropdownOpen && (
          <div
            className='absolute border w-[250px] text-[14px] bg-white mt-0.5 z-10'
            onMouseDown={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  highlightedIndex === index ? 'bg-gray-200' : ''
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleAuthTypeChange(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersAuthType;
