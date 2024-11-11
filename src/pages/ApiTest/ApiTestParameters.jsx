import { useState, useEffect } from 'react';

const ApiTestBody = ({ headers = [], pathVariables = [], queryParameters = [], cookies = [] }) => {
  // State로 데이터를 관리하여 사용자 수정 가능
  const [headersState, setHeaders] = useState(headers);
  const [pathVariablesState, setPathVariables] = useState(pathVariables);
  const [queryParametersState, setQueryParameters] = useState(queryParameters);
  const [cookiesState, setCookies] = useState(cookies);

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
        updateState(headersState, setHeaders);
        break;
      case 'pathVariables':
        updateState(pathVariablesState, setPathVariables);
        break;
      case 'queryParameters':
        updateState(queryParametersState, setQueryParameters);
        break;
      case 'cookies':
        updateState(cookiesState, setCookies);
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
            <th className='py-2 px-4 text-sm border bg-gray-100 w-[40%]'>Parameter Name</th>
            <th className='py-2 px-4 text-sm border bg-gray-100 w-[60%]'>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='py-2 px-4 text-sm border text-center w-[40%]'>{item.key}</td>
              <td className='py-2 px-4 border text-center w-[60%]'>
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
      {headersState.length > 0 && renderTable('Headers', headersState, 'headers')}
      {pathVariablesState.length > 0 && renderTable('Path Variables', pathVariablesState, 'pathVariables')}
      {queryParametersState.length > 0 && renderTable('Query Parameters', queryParametersState, 'queryParameters')}
      {cookiesState.length > 0 && renderTable('Cookies', cookiesState, 'cookies')}
    </div>
  );
};

export default ApiTestBody;
