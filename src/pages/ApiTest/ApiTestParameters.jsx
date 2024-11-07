import { useState } from 'react';

const ApiTestBody = () => {
  // 목업 데이터
  const headersData = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Authorization', value: '***************' },
  ];

  const pathVariablesData = [
    { name: 'membershipId', value: '***************' },
    { name: 'membershipId', value: '***************' },
  ];

  const queryParametersData = [
    { name: 'name', value: '***************' },
    { name: 'userId', value: '***************' },
  ];

  const cookiesData = [
    { name: 'cccccccc', value: '***************' },
    { name: 'tttttttt', value: '***************' },
  ];

  // State로 데이터를 관리하여 사용자 수정 가능
  const [headers, setHeaders] = useState(headersData);
  const [pathVariables, setPathVariables] = useState(pathVariablesData);
  const [queryParameters, setQueryParameters] = useState(queryParametersData);
  const [cookies, setCookies] = useState(cookiesData);

  // 입력값 변경 핸들러
  const handleInputChange = (e, index, type) => {
    const { value } = e.target;
    const updateState = (data, setData) => {
      const updated = [...data];
      updated[index].value = value;
      setData(updated);
    };

    switch (type) {
      case 'headers':
        updateState(headers, setHeaders);
        break;
      case 'pathVariables':
        updateState(pathVariables, setPathVariables);
        break;
      case 'queryParameters':
        updateState(queryParameters, setQueryParameters);
        break;
      case 'cookies':
        updateState(cookies, setCookies);
        break;
      default:
        break;
    }
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
      {/* 조건부 렌더링: 데이터가 있을 때만 테이블을 렌더링 */}
      {headers.length > 0 && renderTable('Headers', headers, 'headers')}
      {pathVariables.length > 0 && renderTable('Path Variables', pathVariables, 'pathVariables')}
      {queryParameters.length > 0 && renderTable('Query Parameters', queryParameters, 'queryParameters')}
      {cookies.length > 0 && renderTable('Cookies', cookies, 'cookies')}
    </div>
  );
};

export default ApiTestBody;
