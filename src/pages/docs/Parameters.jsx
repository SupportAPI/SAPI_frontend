import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

const Parameters = ({paramsChange}) => {
  const [headers, setHeaders] = useState([]); // 추가된 헤더들
  const [authType, setAuthType] = useState('None');
  const [authorization, setAuthorization] = useState('');
  const [queryParams, setQueryParams] = useState([]);
  const [cookies, setCookies] = useState([]);

  useEffect(()=> {
    paramsChange({
      headers,
      authType,
      authorization,
      queryParams,
      cookies,
    });
  }, [headers, authType, authorization, queryParams, cookies]);

  const handleAuthTypeChange = (type) => {
    setAuthType(type);

    // Auth 타입에 따라 Authorization 헤더 값 설정
    if (type === 'Bearer') setAuthorization('Bearer <token>');
    else if (type === 'Basic') setAuthorization('Basic <credentials>');
    else setAuthorization(''); // None 선택 시 비워짐
  };

  useEffect(() => {
    // Authorization 헤더가 중복으로 추가되지 않도록 보장
    setHeaders((prevHeaders) => {
      const index = prevHeaders.findIndex((header) => header.key === 'Authorization');

      // authType이 None이 아닌 경우 Authorization 헤더 추가 또는 업데이트
      if (authType !== 'None') {
        if (index !== -1) {
          // Authorization 헤더가 이미 있을 경우, 값만 업데이트
          const updatedHeaders = [...prevHeaders];
          updatedHeaders[index].value = authorization;
          return updatedHeaders;
        } else {
          // Authorization 헤더가 없을 경우, 새로 추가
          return [{ key: 'Authorization', value: authorization }, ...prevHeaders];
        }
      } else {
        // authType이 None일 경우 Authorization 헤더 제거
        return prevHeaders.filter((header) => header.key !== 'Authorization');
      }
    });
  }, [authorization, authType]);

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleAddQueryParam = () => setQueryParams([...queryParams, { key: '', value: '' }]);
  const handleAddCookie = () => setCookies([...cookies, { key: '', value: '' }]);

  const handleQueryParamChange = (index, field, value) => {
    const updatedParams = [...queryParams];
    updatedParams[index][field] = value;
    setQueryParams(updatedParams);
  };

  const handleCookieChange = (index, field, value) => {
    const updatedCookies = [...cookies];
    updatedCookies[index][field] = value;
    setCookies(updatedCookies);
  };

  const handleRemoveQueryParam = (index) => setQueryParams(queryParams.filter((_, i) => i !== index));
  const handleRemoveCookie = (index) => setCookies(cookies.filter((_, i) => i !== index));

  return (
    <div className='pt-4'>
      {/* Authorization과 Auth Type 설정 */}
      <div className='mb-8'>
        <label className='block text-[18px] font-semibold h-8'>Auth Type</label>
        <select
          value={authType}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
          className='border rounded px-2 py-1 w-full h-10'
        >
          <option value='None'>None</option>
          <option value='Bearer'>Bearer Token</option>
          <option value='Basic'>Basic Auth</option>
        </select>
      </div>

      {/* Headers */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[18px] h-8'>Headers</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 
            hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddHeader}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {/* Headers 테이블 or No headers message */}
        {headers.length === 0 ? (
          <p className='text-gray-500 h-10 mt-2'>No headers added.</p>
        ) : (
          <table className='w-full border mt-2'>
            <tbody>
              {/* Authorization 항목 항상 상단 고정 */}
              {authType !== 'None' && (
                <tr>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      value='Authorization'
                      readOnly
                      className='w-full border-none outline-none text-gray-500'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={authorization}
                      readOnly
                      className='w-full border-none outline-none bg-gray-100 text-gray-500'
                    />
                  </td>
                  <td className='border p-2 text-center text-gray-400'>
                    <span>🗑️</span>
                  </td>
                </tr>
              )}
              {/* 나머지 헤더들 */}
              {headers.map(
                (header, index) =>
                  header.key !== 'Authorization' && (
                    <tr key={index}>
                      <td className='border p-2 h-10'>
                        <input
                          type='text'
                          placeholder='Key'
                          value={header.key}
                          onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                          className='w-full border-none outline-none'
                        />
                      </td>
                      <td className='border p-2'>
                        <input
                          type='text'
                          placeholder='Value'
                          value={header.value}
                          onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                          className='w-full border-none outline-none'
                        />
                      </td>
                      <td
                        className='border p-2 text-center cursor-pointer text-red-500'
                        onClick={() => handleRemoveHeader(index)}
                      >
                        🗑️
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Query Parameters */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[18px] h-8'>Query Parameters</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddQueryParam}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>
        {queryParams.length === 0 ? (
          <p className='text-gray-500 h-10'>No query parameters added.</p>
        ) : (
          <table className='w-full border'>
            <tbody>
              {queryParams.map((param, index) => (
                <tr key={index}>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      placeholder='Key'
                      value={param.key}
                      onChange={(e) => handleQueryParamChange(index, 'key', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={param.value}
                      onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td
                    className='border p-2 text-center cursor-pointer text-red-500'
                    onClick={() => handleRemoveQueryParam(index)}
                  >
                    🗑️
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cookies */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[18px] h-8'>Cookies</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddCookie}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>
        {cookies.length === 0 ? (
          <p className='text-gray-500 h-10'>No cookies added.</p>
        ) : (
          <table className='w-full border'>
            <tbody>
              {cookies.map((cookie, index) => (
                <tr key={index}>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      placeholder='Key'
                      value={cookie.key}
                      onChange={(e) => handleCookieChange(index, 'key', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={cookie.value}
                      onChange={(e) => handleCookieChange(index, 'value', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td
                    className='border p-2 text-center cursor-pointer text-red-500'
                    onClick={() => handleRemoveCookie(index)}
                  >
                    🗑️
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Parameters;
