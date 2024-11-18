import { useEffect, useRef, useState } from 'react';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';
import useAuthStore from '../../stores/useAuthStore';
import ResponseAdd from './ResponseAdd';
import { FaCheck } from 'react-icons/fa';
import { FiMinusSquare } from 'react-icons/fi';
import { Editor } from '@monaco-editor/react';

const Response = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [type, setType] = useState('');
  const [responseList, setResponseList] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [currentResponseId, setCurrentResponseId] = useState(() => {
    return localStorage.getItem('currentResponseId') || undefined;
  });

  const userId = useAuthStore((state) => state.userId);
  const checkOccupation = useOccupationStatus(occupationState, userId);
  const { publish } = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const responseComponentId = `${apiId}-response`;
  const editorComponentId = `${apiId}-editor`;
  const [editorStatus, setEditorStatus] = useState('');

  const responseRefs = useRef({});
  const editorRefs = useRef({});
  const [hoveredResponseId, setHoveredResponseId] = useState(null);

  const setResponseRef = (responseId, element) => {
    responseRefs.current[responseId] = element;
  };

  const setEditorRef = (editorId, element) => {
    editorRefs.current[editorId] = element;
  };

  useEffect(() => {
    if (selectedResponse?.id) {
      const occupationStatus = checkOccupation(editorComponentId + selectedResponse.id);
      setEditorStatus(occupationStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResponse?.id]);

  const handleEditorMount = (editor) => {
    editor.getAction('editor.action.formatDocument').run();
  };

  const handleInputClick = (response) => {
    handleOccupationState('OCCUPATION', 'DELETE', {
      componentId: responseComponentId + selectedResponse.id,
    });
    handleOccupationState('OCCUPATION', 'ADD', {
      componentId: responseComponentId + response.id,
    });
    setSelectedResponse(response);
    setCurrentResponseId(response.id);
  };

  const handleResponseClick = (response) => {
    if (selectedResponse.id === response.id) return;
    setSelectedResponse(response);
  };

  const handleOnBlur = () => {
    handleOccupationState('OCCUPATION', 'DELETE', {
      componentId: responseComponentId + selectedResponse.id,
    });
  };

  const handleMouseMove = throttle((event, id) => {
    const targetElement = responseRefs.current[id];
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  const handleInputChange = (responseId, e) => {
    const updatedResponseList = responseList.map((response) => {
      if (response.id === responseId) {
        return { ...response, name: e.target.value };
      }
      return response;
    });

    setResponseList(updatedResponseList);

    setSelectedResponse((prev) => ({
      ...prev,
      name: e.target.value,
    }));

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'RESPONSE',
      actionType: 'UPDATE',
      message: { id: responseId, key: 'NAME', value: e.target.value },
    });
  };

  useEffect(() => {
    if (apiDocDetail?.response) {
      const sortedResponses = [...apiDocDetail.response].sort((a, b) => a.code - b.code);
      setResponseList(sortedResponses);
    }
  }, [apiDocDetail?.response]);

  useEffect(() => {
    if (responseList.length > 0) {
      // 이미 선택된 값이 있으면 초기화를 건너뜁니다.
      if (selectedResponse.id) return;

      const savedResponseId = localStorage.getItem('currentResponseId');
      const firstResponse = responseList.find((res) => res.id === savedResponseId) || responseList[0];
      setSelectedResponse(firstResponse);
      setCurrentResponseId(firstResponse.id);
    }
  }, [responseList, selectedResponse.id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentResponseId) {
        localStorage.setItem('currentResponseId', currentResponseId);
      }
      handleOccupationState('OCCUPATION', 'DELETE', {
        componentId: responseComponentId + currentResponseId,
      });
      // handleOccupationState('RESPONSE', 'SAVE', {
      //   componentId: responseComponentId + currentResponseId,
      // });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResponseId]);

  const handleResponseDelete = (responseId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'RESPONSE',
      actionType: 'DELETE',
      message: { id: String(responseId) },
    });
  };

  const handleBodyTypeChange = (e) => {
    setSelectedResponse((prev) => ({
      ...prev,
      bodyType: e.target.value,
    }));

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'RESPONSE',
      actionType: 'UPDATE',
      message: {
        id: String(selectedResponse.id),
        key: 'DATA',
        type: e.target.value,
        value: String(selectedResponse.bodyData),
      },
    });
  };

  const handleEditorChange = (value) => {
    // setSelectedResponse((prev) => ({
    //   ...prev,
    //   bodyData: value,
    // }));
    console.log(selectedResponse.bodyType);

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'RESPONSE',
      actionType: 'UPDATE',
      message: { id: selectedResponse.id, key: 'DATA', type: selectedResponse.bodyType, value: value },
    });
  };

  return (
    <div>
      <ResponseAdd
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
      <div className='flex justify-between'>
        {responseList && responseList.length > 0 ? (
          <>
            <div className='w-[350px]'>
              <h3>Status Codes</h3>
              <div className='h-[230px] overflow-auto sidebar-scrollbar'>
                {responseList.map((response, index) => {
                  const responseStatus = checkOccupation(responseComponentId + response.id);
                  return (
                    <div
                      key={response.id}
                      onClick={() => {
                        handleResponseClick(response);
                      }}
                      onMouseEnter={() => setHoveredResponseId(response.id)}
                      onMouseLeave={() => setHoveredResponseId(null)}
                      onMouseMove={(e) => handleMouseMove(e, response.id)}
                      className={`h-10 border flex rounded-sm cursor-pointer transition-shadow duration-300 group hover:bg-gray-50 ${
                        index === 0
                          ? 'my-0'
                          : index === responseList.length - 1 && responseList.length > 2
                          ? 'my-0'
                          : 'my-2'
                      }`}
                    >
                      <div className='flex w-[68px] justify-between items-center px-2'>
                        {selectedResponse.id === response.id ? (
                          <FaCheck className='w-3 text-[14px]' />
                        ) : (
                          <div className='w-3 text-[14px]'></div>
                        )}
                        {response.code}
                      </div>
                      <div className='w-[1px] bg-gray-300 h-[70%] my-auto'></div>
                      <input
                        ref={(el) => setResponseRef(response.id, el)}
                        className='w-[240px] px-2 group-hover:bg-gray-50 outline-none'
                        value={response.name || ''}
                        onClick={(e) => {
                          if (responseStatus.isOccupiedByOthers) {
                            e.preventDefault();
                            return;
                          }
                          handleInputClick(response);
                        }}
                        onMouseEnter={() => (responseStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onChange={(e) => {
                          handleInputChange(response.id, e);
                        }}
                        placeholder='Enter the name'
                        style={{
                          borderColor: responseStatus.isOccupied ? responseStatus.color : undefined,
                          boxShadow: responseStatus.isOccupied ? `0 0 0 2px ${responseStatus.color}` : undefined,
                        }}
                        onBlur={(e) => {
                          if (responseStatus.isOccupiedByOthers) {
                            e.preventDefault();
                            return;
                          }
                          handleOnBlur(response);
                        }}
                      />
                      {responseStatus.isOccupiedByOthers && showTooltip && (
                        <div
                          className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000] `}
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left + 10,
                          }}
                        >
                          <div className='flex items-center space-x-2'>
                            <img
                              src={responseStatus.profileImage}
                              alt={responseStatus.nickname}
                              className='w-6 h-6 rounded-full'
                            />
                            <div className='mx-0 text-sm font-medium'>{responseStatus.nickname}</div>
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex justify-center items-center w-[33px] transition-opacity duration-200 ${
                          hoveredResponseId === response.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <FiMinusSquare
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResponseDelete(response.id);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='relative w-[calc(100%-400px)] h-full'>
              <div className='flex items-center space-x-4 justify-between'>
                <div>Edit</div>
                <div className='flex items-center space-x-4'>
                  <label>
                    <input
                      type='radio'
                      name='bodyType'
                      value='JSON'
                      checked={selectedResponse.bodyType == 'JSON'}
                      onChange={handleBodyTypeChange}
                    />
                    JSON
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='bodyType'
                      value='TEXT'
                      checked={selectedResponse.bodyType == 'TEXT'}
                      onChange={handleBodyTypeChange}
                    />
                    TEXT
                  </label>
                </div>
              </div>
              <div
                className='transition duration-300 border text-[14px] rounded-md'
                style={{
                  borderColor: editorStatus?.isOccupied ? editorStatus?.color : undefined,
                  boxShadow: editorStatus?.isOccupied ? `0 0 0 2px ${editorStatus?.color}` : undefined,
                }}
                onMouseEnter={() => (editorStatus?.isOccupiedByOthers ? setShowTooltip(true) : null)}
                onMouseLeave={() => setShowTooltip(false)}
                ref={(el) => setEditorRef(selectedResponse.id, el)}
                onMouseMove={handleMouseMove}
              >
                <Editor
                  height='230px'
                  language={selectedResponse.bodyType?.toLowerCase()}
                  value={selectedResponse?.bodyData || ''}
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
              </div>
            </div>
          </>
        ) : (
          <div className='p-2 w-full text-center text-gray-500 border rounded-sm h-10'>Is Not Status</div>
        )}
      </div>
    </div>
  );
};

export default Response;
