import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Editor } from '@monaco-editor/react';

const HistoryResponse = ({ response = {} }) => {
  const [selectedCode, setSelectedCode] = useState(null); // useState 수정
  const [responseJson, setResponseJson] = useState('');

  const handleEditorDidMount = (editor, monaco) => {
    editor.updateOptions({ readOnly: true }); // 읽기 전용 설정

    editor.onKeyDown((e) => {
      e.preventDefault(); // 모든 키 입력 차단
    });
  };

  const handleCodeSelection = (res) => {
    if (selectedCode === res.code) {
      setSelectedCode(null);
      setResponseJson('');
    } else {
      setSelectedCode(res.code);
      try {
        if (res.bodyType === 'JSON' && res.bodyData) {
          setResponseJson(JSON.stringify(JSON.parse(res.bodyData), null, 2)); // JSON 문자열 변환
        } else {
          setResponseJson(res.bodyData || '{}'); // JSON이 아닌 경우에도 처리
        }
      } catch (error) {
        console.error('Invalid JSON data:', error);
        setResponseJson('Invalid JSON data');
      }
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>Response</label>
        {response?.length > 0 ? (
          <div className='flex flex-row'>
            <div className='flex flex-col'>
              <div>Status Code</div>
              {response?.map((res, index) => {
                return (
                  <div className='flex flex-row'>
                    <div className='flex flex-row w-[350px] mt-1' onClick={() => handleCodeSelection(res)}>
                      <div className='w-[80px] h-[30px] px-2 flex flex-row items-center border justify-between'>
                        {selectedCode === res.code ? (
                          <FaCheck className='w-14 text-[14px]' />
                        ) : (
                          <div className='w-3 text-[14px]'></div>
                        )}
                        <div className='pr-1'>{res.code}</div>
                      </div>
                      <div className='pl-2 w-[270px] h-[30px] border-y border-r overflow-x-hidden'>{res.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex flex-col w-full'>
              <div className='ml-6'>Response Data</div>
              {responseJson && (
                <Editor
                  height='200px'
                  language='json'
                  value={responseJson || '{}'}
                  options={{
                    automaticLayout: true,
                    autoClosingBrackets: 'always',
                    formatOnType: true,
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    minimap: {
                      enabled: false,
                      renderCharacters: false,
                      showSlider: 'mouseover',
                      decorations: false,
                    },
                  }}
                  onMount={handleEditorDidMount} // onMount를 통해 readOnly 설정
                />
              )}
            </div>
          </div>
        ) : (
          <div>No Response</div>
        )}
      </div>
    </div>
  );
};

export default HistoryResponse;
