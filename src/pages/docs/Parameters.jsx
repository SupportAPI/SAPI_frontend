import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

const Parameters = ({ paramsChange, initialValues }) => {
  const [header, setHeader] = useState(initialValues?.headers || []);
  const [authType, setAuthType] = useState(initialValues?.authType || 'None');
  const [authorization, setAuthorization] = useState('');
  const [queryParameter, setQueryParameter] = useState(initialValues?.queryParameters || []);
  const [cookie, setCookie] = useState(initialValues?.cookies || []);

  useEffect(() => {
    setHeader(initialValues?.headers || []);
    setAuthType(initialValues?.authType || 'None');
    setQueryParameter(initialValues?.queryParameters || []);
    setCookie(initialValues?.cookies || []);
  }, [initialValues]);

  useEffect(() => {
    paramsChange({
      header,
      authType,
      authorization,
      queryParameter,
      cookie,
    });
  }, [header, authType, authorization, queryParameter, cookie]);

  const handleAuthTypeChange = (type) => {
    setAuthType(type);

    if (type === 'Bearer') setAuthorization('Bearer <token>');
    else if (type === 'Basic') setAuthorization('Basic <credentials>');
    else setAuthorization('');
  };

  useEffect(() => {
    setHeader((prevHeaders) => {
      const index = prevHeaders.findIndex((header) => header.headerKey === 'Authorization');

      if (authType !== 'NOAUTH') {
        if (index !== -1) {
          const updatedHeaders = [...prevHeaders];
          updatedHeaders[index].headerValue = authorization;
          return updatedHeaders;
        } else {
          return [{ headerKey: 'Authorization', headerValue: authorization }, ...prevHeaders];
        }
      } else {
        return prevHeaders.filter((header) => header.headerKey !== 'Authorization');
      }
    });
  }, [authorization, authType]);

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...header];
    updatedHeaders[index][field] = value;
    setHeader(updatedHeaders);
  };

  const handleAddHeader = () => {
    setHeader([...header, { headerKey: '', headerValue: '' }]);
  };

  const handleRemoveHeader = (index) => {
    setHeader(header.filter((_, i) => i !== index));
  };

  const handleAddQueryParam = () =>
    setQueryParameter([...queryParameter, { queryParameterKey: '', queryParameterValue: '' }]);
  const handleAddCookie = () => setCookie([...cookie, { cookieKey: '', cookieValue: '' }]);

  const handleQueryParamChange = (index, field, value) => {
    const updatedParams = [...queryParameter];
    updatedParams[index][field] = value;
    setQueryParameter(updatedParams);
  };

  const handleCookieChange = (index, field, value) => {
    const updatedCookies = [...cookie];
    updatedCookies[index][field] = value;
    setCookie(updatedCookies);
  };

  const handleRemoveQueryParam = (index) => setQueryParameter(queryParameter.filter((_, i) => i !== index));
  const handleRemoveCookie = (index) => setCookie(cookie.filter((_, i) => i !== index));

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
          <option value='NOAUTH'>No Auth</option>
          <option value='BEARER'>Bearer Token</option>
          <option value='BASIC'>Basic Auth</option>
        </select>
      </div>

      {/* Headers */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-[18px] h-8'>Headers</h3>
          <button
            className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            onClick={handleAddHeader}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>

        {/* Headers 테이블 or No headers message */}
        {header.length === 0 ? (
          <p className='text-gray-500 h-10 mt-2'>No headers added.</p>
        ) : (
          <table className='w-full border mt-2'>
            <tbody>
              {/* Authorization 항목 항상 상단 고정 */}
              {authType !== 'NOAUTH' && (
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
              {header.map(
                (header, index) =>
                  header.headerKey !== 'Authorization' && (
                    <tr key={index}>
                      <td className='border p-2 h-10'>
                        <input
                          type='text'
                          placeholder='Key'
                          value={header.headerKey}
                          onChange={(e) => handleHeaderChange(index, 'headerKey', e.target.value)}
                          className='w-full border-none outline-none'
                        />
                      </td>
                      <td className='border p-2'>
                        <input
                          type='text'
                          placeholder='Value'
                          value={header.headerValue}
                          onChange={(e) => handleHeaderChange(index, 'headerValue', e.target.value)}
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
        {queryParameter.length === 0 ? (
          <p className='text-gray-500 h-10'>No query parameters added.</p>
        ) : (
          <table className='w-full border'>
            <tbody>
              {queryParameter.map((param, index) => (
                <tr key={index}>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      placeholder='Key'
                      value={param.queryParameterKey}
                      onChange={(e) => handleQueryParamChange(index, 'queryParameterKey', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={param.queryParameterValue}
                      onChange={(e) => handleQueryParamChange(index, 'queryParameterValue', e.target.value)}
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
        {cookie.length === 0 ? (
          <p className='text-gray-500 h-10'>No cookies added.</p>
        ) : (
          <table className='w-full border'>
            <tbody>
              {cookie.map((cookie, index) => (
                <tr key={index}>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      placeholder='Key'
                      value={cookie.cookieKey}
                      onChange={(e) => handleCookieChange(index, 'cookieKey', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={cookie.cookieValue}
                      onChange={(e) => handleCookieChange(index, 'cookieValue', e.target.value)}
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
