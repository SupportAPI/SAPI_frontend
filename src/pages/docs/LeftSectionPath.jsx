import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { throttle } from 'lodash';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { FiChevronDown } from 'react-icons/fi';

const methodStyles = {
  GET: 'text-blue-500',
  POST: 'text-green-500',
  PUT: 'text-orange-500',
  PATCH: 'text-purple-500',
  DELETE: 'text-red-500',
  HEAD: 'text-gray-500',
  OPTIONS: 'text-yellow-500',
};

const LeftSectionPath = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [method, setMethod] = useState('');
  const [path, setPath] = useState('');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const methodTooltipRef = useRef(null);
  const pathTooltipRef = useRef(null);
  const methodRef = useRef(null);
  const pathRef = useRef(null);
  const methodDropdownRef = useRef(null);

  const handleMouseMove = throttle((event, ref) => {
    if (ref.current) {
      const targetRect = ref.current.getBoundingClientRect();
      const relativeX = event.clientX - targetRect.left;
      const relativeY = event.clientY - targetRect.top;

      setTooltipPosition({
        top: relativeY,
        left: relativeX,
      });
    }
  }, 50);

  const methodComponentId = `${apiId}-method`;
  const pathComponentId = `${apiId}-path`;
  const pathStatus = checkOccupation(pathComponentId);
  const methodStatus = checkOccupation(methodComponentId);

  const { publish } = useWebSocket();

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_METHOD',
      actionType: 'UPDATE',
      message: { value: selectedMethod },
    });
    setShowMethodDropdown(false);
  };

  const handlePathChange = (e) => {
    const newPath = e.target.value;
    setPath(newPath);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_PATH',
      actionType: 'UPDATE',
      message: { value: newPath },
    });
  };

  useEffect(() => {
    if (apiDocDetail?.path) setPath(apiDocDetail.path);
    if (apiDocDetail?.method) setMethod(apiDocDetail.method);
  }, [apiDocDetail?.path, apiDocDetail?.method]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        methodDropdownRef.current &&
        !methodDropdownRef.current.contains(event.target) &&
        !methodRef.current.contains(event.target)
      ) {
        setShowMethodDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: methodComponentId });
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: pathComponentId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: methodComponentId });
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: pathComponentId });
    };
  }, []);

  return (
    <>
      <div className='mb-4'>
        <label className='block text-[18px] font-semibold mb-2'>API Path</label>
        <div className='flex border rounded-sm items-center overflow-visible'>
          <div
            onMouseEnter={() => (methodStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={methodTooltipRef}
            onMouseMove={(e) => handleMouseMove(e, methodTooltipRef)}
            className='relative'
          >
            <button
              ref={methodRef}
              className={`px-3 py-2 w-[150px] h-12 focus:outline-none rounded-sm transition duration-300  
                ${methodStyles[method]}
                ${methodStatus.isOccupiedByOthers ? `pointer-events-none` : ``}
              hover:bg-gray-50`}
              style={{
                borderColor: methodStatus.isOccupied ? methodStatus.color : undefined,
                boxShadow: methodStatus.isOccupied ? `0 0 0 2px ${methodStatus.color}` : undefined,
              }}
              onClick={(e) => {
                if (methodStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                setShowMethodDropdown((prev) => !prev);
              }}
              onFocus={(e) => {
                if (methodStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                handleOccupationState('OCCUPATION', 'ADD', { componentId: methodComponentId });
              }}
              onBlur={(e) => {
                if (methodStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                handleOccupationState('OCCUPATION', 'DELETE', { componentId: methodComponentId });
              }}
            >
              <div className='flex justify-between items-center'>
                <span>{method}</span>
                <FiChevronDown className='ml-2' color='black' />
              </div>
            </button>

            {showMethodDropdown && (
              <div
                ref={methodDropdownRef}
                className='absolute left-0 top-[50px] bg-white border rounded-sm shadow-md z-10 w-full'
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
            {methodStatus.isOccupiedByOthers && showTooltip && (
              <div
                className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
                style={{
                  top: tooltipPosition.top,
                  left: tooltipPosition.left + 10,
                }}
              >
                <div className='flex items-center space-x-2'>
                  <img src={methodStatus.profileImage} alt={methodStatus.nickname} className='w-6 h-6 rounded-full' />
                  <div className='mx-0 text-sm font-medium'>{methodStatus.nickname}</div>
                </div>
              </div>
            )}
          </div>

          <div className='w-[2px] bg-gray-200 h-6'></div>

          <div
            onMouseEnter={() => (pathStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={pathTooltipRef}
            onMouseMove={(e) => handleMouseMove(e, pathTooltipRef)}
            className='relative w-full'
          >
            <input
              type='text'
              ref={pathRef}
              className={`px-3 py-2 w-full h-12 focus:outline-none transition duration-300 rounded-sm   
              ${pathStatus.isOccupiedByOthers ? `pointer-events-none` : ``}
            hover:bg-gray-50 `}
              style={{
                borderColor: pathStatus.isOccupied ? pathStatus.color : undefined,
                boxShadow: pathStatus.isOccupied ? `0 0 0 2px ${pathStatus.color}` : undefined,
              }}
              placeholder='Enter URL'
              value={path || ''}
              onChange={handlePathChange}
              onFocus={(e) => {
                if (pathStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                handleOccupationState('OCCUPATION', 'ADD', { componentId: pathComponentId });
              }}
              onBlur={(e) => {
                if (pathStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                handleOccupationState('API_PATH', 'SAVE', { componentId: pathComponentId, value: path });
              }}
            />
            {pathStatus.isOccupiedByOthers && showTooltip && (
              <div
                className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
                style={{
                  top: tooltipPosition.top,
                  left: tooltipPosition.left + 10,
                }}
              >
                <div className='flex items-center space-x-2'>
                  <img src={pathStatus.profileImage} alt={pathStatus.nickname} className='w-6 h-6 rounded-full' />
                  <div className='mx-0 text-sm font-medium'>{pathStatus.nickname}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSectionPath;
