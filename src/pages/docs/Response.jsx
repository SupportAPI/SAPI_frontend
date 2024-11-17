import { useEffect, useRef, useState } from 'react';
import { useOccupationStatus } from '../../hooks/useOccupationStatus';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { throttle } from 'lodash';
import useAuthStore from '../../stores/useAuthStore';
import ResponseAdd from './ResponseAdd';
import { FaCheck } from 'react-icons/fa';

const initialStatusCodes = [
  { code: 100, name: 'Continue', values: '{The server has received the request headers.}' },
  { code: 200, name: 'OK', values: '{The request was successfully completed.}' },
  { code: 300, name: 'Multiple Choices', values: '{The request has more than one possible responses.}' },
  { code: 400, name: 'Bad Request', values: '{The server could not understand the request.}' },
  { code: 500, name: 'Internal Server Error', values: '{The server encountered an internal error.}' },
  { code: 500, name: 'Internal Server Error', values: '{The server encountered an internal error.}' },
  { code: 500, name: 'Internal Server Error', values: '{The server encountered an internal error.}' },
];

const Response = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
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
  const editorStatus = useOccupationStatus(editorComponentId);

  const responseRefs = useRef({});
  const editorRef = useRef(null);

  const setResponseRef = (responseId, element) => {
    responseRefs.current[responseId] = element;
  };

  const handleResponseClick = (response) => {
    console.log('눌림');
  };

  const handleMouseMove = throttle((event, ref, id) => {
    const targetElement = ref.current[id];
    if (targetElement) {
      setTooltipPosition({
        top: event.clientY,
        left: event.clientX + 10,
      });
    }
  }, 50);

  useEffect(() => {
    if (apiDocDetail?.response) setResponseList(apiDocDetail?.response || []);
  }, [apiDocDetail?.response]);

  const handleInputChange = () => {};

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
        <div className='w-[300px]'>
          <h3>Status Codes</h3>
          <div className='h-[230px] overflow-auto sidebar-scrollbar'>
            {responseList.map((response, index) => {
              const responseStatus = checkOccupation(responseComponentId + response.id);

              return (
                <div
                  key={index}
                  ref={(el) => setResponseRef(response.id, el)}
                  onClick={() => handleResponseClick(response)}
                  className={`py-1 h-10 border flex rounded-sm cursor-pointer hover:bg-gray-50 transition-shadow duration-300 ${
                    index !== 0 && index !== initialStatusCodes.length - 1 ? 'my-2' : ''
                  }`}
                  style={{
                    borderColor: responseStatus.isOccupied ? responseStatus.color : undefined,
                    boxShadow: responseStatus.isOccupied ? `0 0 0 2px ${responseStatus.color}` : undefined,
                  }}
                >
                  <div className='flex justify-center items-center px-2'>{response.code}</div>
                  <div className='w-[1px] bg-gray-300 h-full'></div>
                  <input
                    className='w-full px-2 py-2'
                    value={response.name}
                    onChange={(e) => {
                      e.preventDefault();
                      handleInputChange(e, response.code);
                    }}
                    placeholder='Enter the name'
                  />
                  <div className='w-[1px] bg-gray-300 h-full'></div>
                  <FaCheck className='px-2 w-10 flex justify-center items-center h-full' />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
