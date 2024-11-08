import { useState } from 'react';

const ApiTestParameters = () => {
  const [bodyType, setBodyType] = useState('FORM_DATA'); // NONE, JSON, FORM_DATA

  // 목업 데이터
  const responsesData = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Authorization', value: '***************' },
  ];

  // State로 데이터를 관리하여 사용자 수정 가능
  const [responses, setResponses] = useState(responsesData);
  const [jsonData, setJsonData] = useState(''); // JSON 데이터를 관리하는 state

  // 입력값 변경 핸들러
  const handleInputChange = (e, index, type) => {
    const { value } = e.target;
    const updateState = (data, setData) => {
      const updated = [...data];
      updated[index].value = value;
      setData(updated);
    };

    switch (type) {
      case 'responses':
        updateState(responses, setResponses);
        break;

      default:
        break;
    }
  };

  // JSON 데이터 변경 핸들러
  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  // 공통 테이블 렌더링 함수
  const renderTable = (title, data, type) => (
    <div className='mb-4'>
      <h3 className='font-bold text-sm mb-2'>{title}</h3>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Parameter Name</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='py-2 px-4 text-sm border text-center'>{item.name}</td>
              <td className='py-2 px-4 border text-center'>
                <input
                  type='text'
                  value={item.value}
                  onChange={(e) => handleInputChange(e, index, type)}
                  className='w-full text-sm border p-1 text-center'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className='flex items-center'>
        <div>나중에 없앨 버튼 ----</div>
        <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('NONE')}>
          NONE
        </button>
        <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('JSON')}>
          JSON
        </button>
        <button className='mr-4 border p-2 bg-blue-300' onClick={() => setBodyType('FORM_DATA')}>
          FORM-DATA
        </button>
      </div>
      {/* bodyType에 따른 조건부 렌더링 */}
      {bodyType === 'NONE' && <p className='mt-5 text-center text-gray-500'>No Body</p>}

      {bodyType === 'JSON' && (
        <div className='mb-4'>
          <h3 className='font-bold text-sm mb-2'>JSON Body</h3>
          <textarea
            value={jsonData}
            onChange={handleJsonChange}
            rows='10'
            className='w-full border border-gray-300 p-2 text-sm'
            placeholder='Enter JSON data here'
          />
        </div>
      )}

      {bodyType === 'FORM_DATA' && responses.length > 0 && renderTable('Form Data', responses, 'responses')}
    </div>
  );
};

export default ApiTestParameters;
