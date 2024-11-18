import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { throttle } from 'lodash';
import { useWebSocket } from '../../contexts/WebSocketProvider';

const LeftSectionName = ({ initialName, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [name, setName] = useState();
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef();
  const nameRef = useRef(null);

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

  const nameComponentId = `${apiId}-name`;
  const nameStatus = checkOccupation(nameComponentId);

  const { publish } = useWebSocket();

  const handleOnFocus = (e) => {
    if (nameStatus.isOccupiedByOthers) {
      e.preventDefault();
      return;
    }
    handleOccupationState('OCCUPATION', 'ADD', { componentId: nameComponentId });
  };

  const handleOnBlur = (e) => {
    if (nameStatus.isOccupiedByOthers) {
      e.preventDefault();
      return;
    }
    handleOccupationState('API_NAME', 'SAVE', { componentId: nameComponentId, value: name });
  };

  // API 이름 변경 처리
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_NAME',
      actionType: 'UPDATE',
      message: { value: newName },
    });
  };

  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: nameComponentId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: nameComponentId });
    };
  }, []);

  return (
    <>
      <div
        onMouseEnter={() => (nameStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
        onMouseLeave={() => setShowTooltip(false)}
        ref={targetRef}
        onMouseMove={handleMouseMove}
        className='relative'
      >
        <input
          type='text'
          ref={nameRef}
          className={`truncate rounded-sm border w-auto max-w-[200px] text-[14px] px-3 py-2 h-10
                focus:outline-none transition duration-300
                ${nameStatus.isOccupiedByOthers ? `pointer-events-none` : ``}
                hover:bg-gray-50`}
          style={{
            borderColor: nameStatus.isOccupied ? nameStatus.color : undefined,
            boxShadow: nameStatus.isOccupied ? `0 0 0 2px ${nameStatus.color}` : undefined,
          }}
          value={name || ''}
          placeholder='Enter API Name'
          onChange={handleNameChange}
          onFocus={(e) => handleOnFocus(e)}
          onBlur={(e) => handleOnBlur(e)}
        />
        {nameStatus.isOccupiedByOthers && showTooltip && (
          <div
            className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left + 10,
            }}
          >
            <div className='flex items-center space-x-2'>
              <img src={nameStatus.profileImage} alt={nameStatus.nickname} className='w-6 h-6 rounded-full' />
              <div className='mx-0 text-sm font-medium'>{nameStatus.nickname}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftSectionName;
