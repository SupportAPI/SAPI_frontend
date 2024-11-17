import { Editor } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';

const ResponseEditor = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [response, setResponse] = useState([]);
  const [currentResponseId, setcurrentResponseId] = useState(() => {
    return localStorage.getItem('currentResponseId') || undefined;
  });
  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const responseComponentId = `${apiId}-response`;

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

  const handleAddCode = () => {
    const newCode = prompt('Enter a new status code (number):');
    if (newCode && !statusCodes.some((item) => item.code === parseInt(newCode, 10))) {
      setStatusCodes((prev) =>
        [...prev, { code: parseInt(newCode, 10), name: 'New Code', details: 'Details...' }].sort(
          (a, b) => a.code - b.code
        )
      );
    }
  };

  const handleSelectCode = (code) => {
    const selected = statusCodes.find((item) => item.code === code);
    setSelectedCode(selected);
    setEditorContent(JSON.stringify({ Response: selected }, null, 2));
  };

  const handleSave = () => {
    if (selectedCode) {
      const updatedContent = JSON.parse(editorContent).Response;
      setStatusCodes((prev) =>
        prev.map((item) =>
          item.code === selectedCode.code
            ? { ...item, name: updatedContent.name, details: updatedContent.details }
            : item
        )
      );
      alert('Changes saved!');
    }
  };

  useEffect(() => {
    if (apiDocDetail?.response) setResponse(apiDocDetail?.response || []);
  }, [apiDocDetail?.response]);

  return (
    <div
      className='relative w-[calc(100%-150px)] h-full border'
      onMouseEnter={() => (jsonStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={targetRef}
      onMouseMove={handleMouseMove}
    >
      <h3>Edit</h3>
      <Editor
        height='200px'
        language='json'
        value={JSON.stringify(json?.value || {}, null, 2)}
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
      {responseStatus.isOccupiedByOthers && showTooltip && (
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
  );
};

export default ResponseEditor;
