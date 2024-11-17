import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import useAuthStore from '../../stores/useAuthStore';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';

const RequestJson = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [bodyType, setBodyType] = useState('');
  const [json, setJson] = useState({});
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const { publish } = useWebSocket();

  const jsonComponentId = `${apiId}-json`;
  const jsonStatus = checkOccupation(jsonComponentId);

  const targetRef = useRef(null);

  const handleMouseMove = throttle((event) => {
    const targetElement = targetRef.current;
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  useEffect(() => {
    if (apiDocDetail.request?.bodyType) {
      setBodyType(apiDocDetail.request.bodyType || '');
    }
    if (apiDocDetail.request?.json) {
      setJson(apiDocDetail.request?.json || {});
    }
  }, [apiDocDetail.request?.bodyType, apiDocDetail.request?.json]);

  const handleEditorChange = (value) => {
    setJson((prevJson) => ({
      ...prevJson,
      value,
    }));

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_JSON',
      actionType: 'UPDATE',
      message: { value },
    });
  };

  const handleEditorMount = (editor) => {
    editor.getAction('editor.action.formatDocument').run();
  };

  const handleBeautify = () => {
    try {
      const formattedJson = JSON.stringify(json?.value || {}, null, 2);
      setJson({ value: JSON.parse(formattedJson) });
    } catch (e) {
      console.error('Error beautifying JSON:', e);
    }
  };

  return (
    <div className='pb-8'>
      <div className='mb-4'>
        <div className='flex items-center justify-between w-[calc(100%-150px)]'>
          <label className='text-[16px] font-semibold'>Json Data</label>
          <button
            className='px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'
            onClick={handleBeautify}
          >
            Beautify
          </button>
        </div>
        <div
          className='relative w-[calc(100%-150px)] h-full border'
          onMouseEnter={() => (jsonStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
          onMouseLeave={() => setShowTooltip(false)}
          ref={targetRef}
          onMouseMove={handleMouseMove}
          onFocus={() => {
            console.log('focus');
          }}
          onBlur={() => {
            publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
              apiType: 'REQUEST_JSON',
              actionType: 'SAVE',
              message: { id: String(json.id), componentId: String(jsonComponentId), value: String(json.value) },
            });
          }}
        >
          <Editor
            height='200px'
            language='json'
            value={typeof json.value === 'string' ? json.value : JSON.stringify(json.value || {}, null, 2)}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            options={{
              automaticLayout: true,
              autoClosingBrackets: 'always',
              formatOnType: true,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              cursorStyle: 'line',
              readOnly: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              selectionHighlight: true,
              contextmenu: true,
              minimap: {
                enabled: false,
                renderCharacters: false,
                showSlider: 'mouseover',
                decorations: false,
              },
            }}
          />
          {jsonStatus.isOccupiedByOthers && showTooltip && (
            <div
              className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]`}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left + 10,
              }}
            >
              <div className='flex items-center space-x-2'>
                <img src={jsonStatus.profileImage} alt={jsonStatus.nickname} className='w-6 h-6 rounded-full' />
                <div className='mx-0 text-sm font-medium'>{jsonStatus.nickname}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestJson;
