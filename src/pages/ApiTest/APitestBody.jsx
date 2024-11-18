import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';
import { useParams } from 'react-router';
import { requestApiTestFileUpload, requestApiTestFileRemove } from '../../api/queries/useApiTestQueries';

const ApiTestParameters = ({ body, bodyChange }) => {
  const [bodyType, setBodyType] = useState(body.bodyType);
  const [json, setJson] = useState(body.json || { id: '', value: '{}' });
  const [formData, setFormData] = useState(body.formData || []);
  const { environment } = useEnvironmentStore();
  const [envDropdown, setEnvDropdown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { workspaceId } = useParams();

  console.log(formData);

  useEffect(() => {
    bodyChange({
      bodyType,
      json,
      formData,
    });
  }, [bodyType, json, formData]);

  const handleFormDataChange = () => {
    try {
      const parsed = JSON.parse(json.value || '{}');
      setJson({
        id: json.id,
        value: JSON.stringify(parsed, null, 2),
      });
      toast('JSON 정렬이 완료되었습니다.');
    } catch (e) {
      toast('유효한 JSON 형식이 아닙니다.');
    }
  };

  useEffect(() => {
    try {
      const parsed = JSON.parse(json.value || '{}');
      setJson({
        id: json.id,
        value: JSON.stringify(parsed, null, 2),
      });
    } catch (e) {
      toast('유효한 JSON 형식이 아닙니다.');
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const cursorPosition = e.target.selectionStart;
    const updatedFormData = [...formData];
    updatedFormData[index].value = value;
    setFormData(updatedFormData);

    // Detect nearest `{{` and update envDropdown
    const nearestStartIndex = value.lastIndexOf('{{', cursorPosition - 1);
    if (nearestStartIndex !== -1) {
      const afterStart = value.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);

      setEnvDropdown(environment?.filter((env) => env.value.startsWith(searchValue)));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleEnvironmentSelect = (selectedVariable, index) => {
    const updatedFormData = [...formData];
    const originalValue = updatedFormData[index].value;

    const nearestStartIndex = originalValue.lastIndexOf('{{');
    if (nearestStartIndex !== -1) {
      const afterStart = originalValue.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const endIndex = firstSpaceIndex === -1 ? originalValue.length : nearestStartIndex + 2 + firstSpaceIndex;

      const newValue =
        originalValue.slice(0, nearestStartIndex) + `{{${selectedVariable}}}` + originalValue.slice(endIndex);

      updatedFormData[index].value = newValue;
      setFormData(updatedFormData);
    }

    setShowDropdown(false);
  };

  const handleJsonEditorChange = (value) => {
    setJson({ ...json, value });

    // `{{`가 입력되었을 때 자동완성 목록을 강제로 보여줌
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === '{{') {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider('json', {
      triggerCharacters: ['{'],
      provideCompletionItems: (model, position) => {
        const textBeforeCursor = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // 커서 앞에 '{{'가 있는지 확인하여 자동완성 제안을 제공합니다
        if (textBeforeCursor === '{{') {
          const suggestions = environment.map((env) => ({
            label: env.variable,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `${env.variable}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: `Insert ${env.variable}`,
          }));
          return { suggestions };
        }
        return { suggestions: [] };
      },
    });
  };

  const handleCheckboxChange = (event, id) => {
    const { checked } = event.target;

    setFormData((prevFormData) =>
      prevFormData.map((item) => (item.id === id ? { ...item, isChecked: checked } : item))
    );
  };

  // 파일 업로드 핸들러 함수
  const handleFileUpload = async (event, index) => {
    const file = event.target.files[0]; // 선택된 파일
    console.log('File Type:', file.type);

    if (!file) return;

    try {
      // // 파일을 이진 데이터로 변환
      // const binaryData = await fileToBinary(file);
      // console.log('Binary Data:', binaryData);

      // // 파일 객체 생성
      // // const binaryFile = new File([binaryData], file.name, { type: file.type });

      // API 호출
      const response = await requestApiTestFileUpload(workspaceId, file);

      // 폼 데이터 업데이트 (선택적으로 파일 이름 저장)
      const updatedFormData = [...formData];
      updatedFormData[index].value = {
        id: response.id,
        fileName: response.fileName,
      };
      console.log(updatedFormData[index].value);
      setFormData(updatedFormData);

      toast.success('파일 업로드 성공!');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      toast.error('파일 업로드 실패!');
    }
  };

  // // 파일을 Binary로 변환하는 유틸리티 함수
  // const fileToBinary = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     // 파일 읽기 완료 시 호출
  //     reader.onload = (event) => {
  //       if (event.target.result) {
  //         resolve(event.target.result); // Binary 데이터 반환
  //       } else {
  //         reject(new Error('파일 변환 실패'));
  //       }
  //     };

  //     // 파일 읽기 오류 처리
  //     reader.onerror = () => {
  //       reject(new Error('파일 읽기 오류'));
  //     };

  //     // 파일을 ArrayBuffer 형식으로 읽기
  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  // 파일 삭제 핸들러 함수
  const handleFileRemove = async (index) => {
    const fileData = formData[index].value;
    console.log(fileData);

    if (!fileData || !fileData.id) {
      toast.error('삭제할 파일이 없습니다.');
      return;
    }

    try {
      // 서버에 파일 삭제 요청
      console.log(fileData.id);
      await requestApiTestFileRemove(workspaceId, fileData.id);

      // 폼 데이터에서 파일 제거
      const updatedFormData = [...formData];
      updatedFormData[index].value = null; // 파일 데이터 초기화
      setFormData(updatedFormData);

      toast.success('파일 삭제 성공!');
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      toast.error('파일 삭제 실패!');
    }
  };

  const renderFormDataTable = () => (
    <div className='mb-4'>
      <h3 className='font-bold text-sm mb-2'>Form Data</h3>
      <table className='w-full  border-gray-300'>
        <thead>
          <tr>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Checked</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Requirement</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Key</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Value</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Descriotion</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => {
            const fileInputRef = useRef(null); // 각 파일 인풋에 고유한 ref 생성
            return (
              <tr key={index} className='hover:bg-gray-50 h-20'>
                <td className='py-2 px-4 text-sm border text-center'>
                  <label>
                    <input
                      type='checkbox'
                      name={item.id} // 고유한 ID나 키 값을 사용
                      checked={item.isChecked} // 현재 체크 상태
                      onChange={(event) => handleCheckboxChange(event, item.id)} // 상태 변경 핸들러
                    />
                  </label>
                </td>
                <td className='py-2 px-4 text-sm border text-center'>{item.isRequired ? `Required` : `Optional`}</td>
                <td className='px-4 py-2 text-sm flex items-center border-b justify-between h-20'>
                  <div>{item.key}</div>
                  <div className='w-[55px] bg-white border text-center'>{item.type}</div>
                </td>
                <td className='py-2 px-4 border text-center relative'>
                  {item.type === 'TEXT' && (
                    <>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => handleInputChange(e, index)}
                        className='w-full text-sm'
                      />
                      {showDropdown && (
                        <div className='absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10'>
                          {envDropdown.map((env, i) => (
                            <div
                              key={i}
                              onClick={() => handleEnvironmentSelect(env.variable, index)}
                              className='p-2 text-sm hover:bg-gray-100 cursor-pointer'
                            >
                              {env.variable}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {item.type === 'FILE' && (
                    <div className='w-full flex flex-row justify-between'>
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, index)}
                        className='w-[80%] text-sm p-1 text-center'
                      />
                      <button
                        onClick={() => {
                          handleFileRemove(index);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                          }
                        }}
                        className='w-[20%] text-center text-sm'
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </td>
                <td className='py-2 px-4 border text-center'>{item.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (!json) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {bodyType === 'NONE' && <p className='mt-5 text-center text-gray-500'>No Body</p>}

      {bodyType === 'JSON' && (
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-4'>
            <div className='font-bold text-sm'>JSON Body</div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleFormDataChange}>
              JSON 정렬
            </button>
          </div>

          <Editor
            height='200px'
            language='json'
            value={json.value || '{}'}
            onMount={handleEditorDidMount} // 에디터가 로드될 때 호출
            onChange={handleJsonEditorChange}
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
          />
        </div>
      )}

      {bodyType === 'FORM_DATA' && renderFormDataTable()}
    </div>
  );
};

export default ApiTestParameters;
