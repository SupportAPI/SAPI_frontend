import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { throttle } from 'lodash';
import { useWebSocket } from '../../contexts/WebSocketProvider';

const LeftSectionDescription = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [description, setDescription] = useState();
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef();
  const descriptionRef = useRef(null);

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

  const descriptionComponentId = `${apiId}-description`;
  const descriptionStatus = checkOccupation(descriptionComponentId);

  const { publish } = useWebSocket();

  // API 이름 변경 처리
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'API_DESCRIPTION',
      actionType: 'UPDATE',
      message: { value: newDescription },
    });
  };

  useEffect(() => {
    if (apiDocDetail.description) setDescription(apiDocDetail.description);
  }, [apiDocDetail.description]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: descriptionComponentId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleOccupationState('OCCUPATION', 'DELETE', { componentId: descriptionComponentId });
    };
  }, []);

  return (
    <>
      <div
        onMouseEnter={() => (descriptionStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
        onMouseLeave={() => setShowTooltip(false)}
        ref={targetRef}
        onMouseMove={handleMouseMove}
        className='relative'
      >
        <div className='mb-4'>
          <label className='block font-semibold mb-2 text-[18px]'>Description</label>
          <textarea
            ref={descriptionRef}
            className={`border rounded-sm w-full px-3 py-2 h-24 focus:outline-none transition duration-300'
              ${descriptionStatus.isOccupiedByOthers ? `pointer-events-none` : ``}
                hover:bg-gray-50`}
            style={{
              borderColor: descriptionStatus.isOccupied ? descriptionStatus.color : undefined,
              boxShadow: descriptionStatus.isOccupied ? `0 0 0 2px ${descriptionStatus.color}` : undefined,
              resize: 'none',
            }}
            placeholder='Enter description here.'
            value={description || ''}
            onChange={handleDescriptionChange}
            onFocus={(e) => {
              if (descriptionStatus.isOccupiedByOthers) {
                e.preventDefault();
                return;
              }
              handleOccupationState('OCCUPATION', 'ADD', { componentId: descriptionComponentId });
            }}
            onBlur={(e) => {
              if (descriptionStatus.isOccupiedByOthers) {
                e.preventDefault();
                return;
              }
              handleOccupationState('API_DESCRIPTION', 'SAVE', {
                componentId: descriptionComponentId,
                value: description,
              });
            }}
          />
        </div>
        {descriptionStatus.isOccupiedByOthers && showTooltip && (
          <div
            className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left + 10,
            }}
          >
            <div className='flex items-center space-x-2'>
              <img
                src={descriptionStatus.profileImage}
                alt={descriptionStatus.nickname}
                className='w-6 h-6 rounded-full'
              />
              <div className='mx-0 text-sm font-medium'>{descriptionStatus.nickname}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftSectionDescription;
