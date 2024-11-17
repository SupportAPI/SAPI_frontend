import { useEffect, useRef, useState } from 'react';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';
import useAuthStore from '../../stores/useAuthStore';
import { FiChevronDown } from 'react-icons/fi';

const statusCodeOptions = [200, 201, 204, 301, 302, 304, 307, 400, 401, 403, 404, 405, 409, 429, 500];

const ResponseAdd = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [response, setResponse] = useState([]);
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const responseComponentId = `${apiId}-response`;
  const responseStatus = checkOccupation(responseComponentId);
  const targetRef = useRef(null);
  const responseRef = useRef(null);

  const handleMouseMove = throttle((event) => {
    const targetElement = targetRef.current;
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  const handleAddResponse = (option) => {
    console.log(option);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'RESPONSE',
      actionType: 'ADD',
      message: { value: String(option) },
    });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (apiDocDetail?.response) setResponse(apiDocDetail?.response || []);
  }, [apiDocDetail?.response]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (responseRef.current && !responseRef.current.contains(event.target)) {
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: responseComponentId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: responseComponentId });
    };
  }, []);

  return (
    <div className='pt-4'>
      <div className='mb-4'>
        <div className='flex justify-between'>
          <label className='flex items-center text-[16px] font-semibold h-8 mb-1'>Response</label>
          <div
            onMouseEnter={() => (responseStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={targetRef}
            onMouseMove={handleMouseMove}
            className='relative'
          >
            <div
              ref={responseRef}
              className='flex w-20 transition duration-300 justify-between items-center border h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-gray-200 px-2 rounded-md'
              style={{
                borderColor: responseStatus.isOccupied ? responseStatus.color : undefined,
                boxShadow: responseStatus.isOccupied ? `0 0 0 2px ${responseStatus.color}` : undefined,
              }}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                if (responseStatus.isOccupiedByOthers) {
                  return;
                }
                setIsDropdownOpen((prev) => !prev);
                if (!isDropdownOpen) {
                  handleOccupationState('OCCUPATION', 'ADD', { componentId: responseComponentId });
                } else {
                  handleOccupationState('OCCUPATION', 'DELETE', { componentId: responseComponentId });
                }
              }}
              onBlur={(e) => {
                if (responseStatus.isOccupiedByOthers) {
                  e.preventDefault();
                  return;
                }
                handleOccupationState('OCCUPATION', 'DELETE', { componentId: responseComponentId });
              }}
            >
              ADD
              <FiChevronDown className='ml-2' color='black' />
            </div>
            {isDropdownOpen && (
              <div
                className='absolute border w-20 h-[250px] overflow-auto sidebar-scrollbar text-[14px] bg-white mt-0.5 z-10'
                onMouseDown={(e) => e.stopPropagation()}
              >
                {statusCodeOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 `}
                    onClick={() => handleAddResponse(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {responseStatus.isOccupiedByOthers && showTooltip && (
            <div
              className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left + 10,
              }}
            >
              <div className='flex items-center space-x-2'>
                <img src={responseStatus.profileImage} alt={responseStatus.nickname} className='w-6 h-6 rounded-full' />
                <div className='mx-0 text-sm font-medium'>{responseStatus.nickname}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseAdd;
