import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketContext';

const Parameters = ({ paramsChange, initialValues, workspaceId, apiId, handleOccupationState }) => {
  const [header, setHeader] = useState(initialValues?.headers || []);
  const [authType, setAuthType] = useState(initialValues?.authType);
  const [authorization, setAuthorization] = useState('');
  const [queryParameter, setQueryParameter] = useState(initialValues?.queryParameters || []);
  const [cookie, setCookie] = useState(initialValues?.cookies || []);
  const { publish } = useWebSocket();

  // 점유상태에 쓸 아이디들
  const occupationAuthType = `${apiId}-authtype`;
  const occupationQueryParpameter = `${apiId}-queryparameter`;

  const authtypeRef = useRef(null);
  const queryparameterRef = useRef(null);

  useEffect(() => {
    // 내부 상태를 분명하게 설정하기 위해 개별적으로 업데이트
    setHeader(initialValues?.headers || []);
    setAuthType(initialValues?.authType || 'None');
    setQueryParameter(initialValues?.queryParameters || []);
    setCookie(initialValues?.cookies || []);
    // setAuthorization(''); // 필요 시 초기화
  }, [initialValues]);

  useEffect(() => {
    paramsChange({
      header,
      authType,
      authorization,
      queryParameter,
      cookie,
    });
  }, [header, authType, authorization, queryParameter, cookie, paramsChange]);

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

  const handleAddQueryParam = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'ADD',
      message: {},
    });
  };

  const handleRemoveQueryParam = (queryParameterId) => {
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'DELETE',
      message: {
        id: queryParameterId,
      },
    });
  };

  const handleAddCookie = () => setCookie([...cookie, { cookieKey: '', cookieValue: '' }]);

  const updateQueryParameterById = (queryParameterId, type, value) => {
    const updatedQueryParameters = queryParameter.map((param) => {
      if (String(param.id) === String(queryParameterId)) {
        if (type === 'KEY') {
          return {
            ...param,
            ['key']: value,
          };
        } else if (type === 'VALUE') {
          return {
            ...param,
            ['value']: value,
          };
        }
      }
      return param;
    });

    return updatedQueryParameters;
  };

  const handleQueryParamChange = async (queryParameterId, type, value) => {
    const updatedparameters = await updateQueryParameterById(queryParameterId, type, value);
    setQueryParameter(updatedparameters);
    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_QUERY_PARAMETERS',
      actionType: 'UPDATE',
      message: {
        id: `${queryParameterId}`,
        type: type,
        value: JSON.stringify(updatedparameters),
      },
    });
  };

  const handleCookieChange = (index, field, value) => {
    const updatedCookies = [...cookie];
    updatedCookies[index][field] = value;
    setCookie(updatedCookies);
  };

  const handleRemoveCookie = (index) => setCookie(cookie.filter((_, i) => i !== index));

  const handleAuthTypeChange = (type) => {
    const newAuthType = type;
    setAuthType(type);

    if (type === 'Bearer') setAuthorization('Bearer <token>');
    else if (type === 'Basic') setAuthorization('Basic <credentials>');
    else setAuthorization('');

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'PARAMETERS_AUTH_TYPE',
      actionType: 'UPDATE',
      message: { value: newAuthType },
    });
  };

  return (
    <div className='pt-4'>
      {/* Authorization과 Auth Type 설정 */}
      <div className='mb-8'>
        <label className='block text-[18px] font-semibold h-8'>Auth Type</label>
        <select
          value={authType}
          ref={authtypeRef}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
          onFocus={() => {
            handleOccupationState(occupationAuthType, 'UPDATE');
            // handleInputFocus(); // 얘 는 어따가 쓰는애임??
          }}
          onBlur={() => handleOccupationState(occupationAuthType, 'DELETE')}
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
                  <td>Check Box</td>
                  <td>isEssential?</td>
                  <td className='border p-2 h-10'>
                    <input
                      type='text'
                      placeholder='Key'
                      value={param.key}
                      ref={queryparameterRef}
                      onChange={(e) => handleQueryParamChange(param.id, 'KEY', e.target.value)}
                      onFocus={() => {
                        handleOccupationState(occupationQueryParpameter, 'UPDATE');
                        // handleInputFocus();
                      }}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td className='border p-2'>
                    <input
                      type='text'
                      placeholder='Value'
                      value={param.value}
                      onChange={(e) => handleQueryParamChange(param.id, 'VALUE', e.target.value)}
                      className='w-full border-none outline-none'
                    />
                  </td>
                  <td
                    className='border p-2 text-center cursor-pointer text-red-500'
                    onClick={() => {
                      handleRemoveQueryParam(param.id);
                    }}
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
