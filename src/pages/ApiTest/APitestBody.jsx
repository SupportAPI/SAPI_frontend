import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';

const ApiTestParameters = ({ body }) => {
  // bodyType, JSON, FORM_DATA 데이터를 prop에서 받아 초기화
  const [bodyType, setBodyType] = useState(body.bodyType); // NONE, JSON, FORM_DATA
  const [jsonData, setJsonData] = useState(body.json.value || {});
  const [formData, setFormData] = useState(body.formData || []); // formData가 없을 경우 빈 배열로 초기화

  useEffect(() => {
    // body prop이 업데이트될 때마다 상태를 업데이트
    // setBodyType(body.bodyType);
    setBodyType('FORM_DATA');
    setJsonData(body.json.value);
    setFormData(body.formData);
  }, [body]);

  // JSON 데이터 변경 핸들러
  const handleFormDataChange = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
      toast('JSON 정렬이 완료되었습니다.');
    } catch (e) {
      toast('유효한 JSON 형식이 아닙니다.');
    }
  };

  // 맨 처음 들어오면 바로 정렬 시켜버리기
  // useEffect에 빈칸으로 보내면 정렬만 됨
  useEffect(() => {
    const parsed = JSON.parse(jsonData);
    setJsonData(JSON.stringify(parsed, null, 2));
  }, []);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index].value = value;
    setFormData(updatedFormData);
  };

  // Form Data 테이블 렌더링 함수
  const renderFormDataTable = () => (
    <div className='mb-4'>
      <h3 className='font-bold text-sm mb-2'>Form Data</h3>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Parameter Name</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Value</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='py-2 px-4 text-sm border text-center'>{item.key}</td>
              <td className='py-2 px-4 border text-center'>
                <input
                  type='text'
                  value={item.value}
                  onChange={(e) => handleInputChange(e, index)}
                  className='w-full text-sm border p-1 text-center'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!jsonData) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div>
      {/* <div className='flex items-center mb-4'> */}
      {/* Body Type을 수동으로 변경하는 버튼들 (테스트용) */}
      {/* <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('NONE')}>
          NONE
        </button>
        <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('JSON')}>
          JSON
        </button>
        <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('FORM_DATA')}>
          FORM-DATA
        </button>
      </div> */}

      {/* bodyType에 따른 조건부 렌더링 */}
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
            value={jsonData || '{}'} // JSON 데이터 기본 값 설정
            onChange={(value) => setJsonData(value || '{}')} // 변경된 부분
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

      {bodyType === 'FORM_DATA' && formData.length > 0 && renderFormDataTable()}
    </div>
  );
};

export default ApiTestParameters;
