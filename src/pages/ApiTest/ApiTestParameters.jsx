import { useState, useEffect } from 'react';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';

const ApiTestBody = ({ initialValues, paramsChange }) => {
  const [headers, setHeaders] = useState(initialValues?.headers || []);
  const [pathVariables, setPathVariables] = useState(initialValues?.pathVariables || []);
  const [queryParameters, setQueryParameters] = useState(initialValues?.queryParameters || []);
  const [cookies, setCookies] = useState(initialValues?.cookies || []);
  const [authType, setAuthType] = useState(initialValues?.authType || 'None');

  const { environment } = useEnvironmentStore();
  const [envDropdown, setEnvDropDown] = useState([]);
  const [showHeadersDropdown, setShowHeadersDropdown] = useState([]);
  const [showPathVariablesDropdown, setShowPathVariablesDropdown] = useState([]);
  const [showQueryParametersDropdown, setShowQueryParametersDropdown] = useState([]);
  const [showCookiesDropdown, setShowCookiesDropdown] = useState([]);

  const [hoveredEnvIndex, setHoveredEnvIndex] = useState(null); // hover된 항목의 인덱스를 저장하는 상태

  useEffect(() => {
    paramsChange({
      headers,
      pathVariables,
      queryParameters,
      cookies,
      authType,
    });
  }, [headers, pathVariables, queryParameters, cookies, authType]);

  const handleInputChange = (e, index, type) => {
    const { value } = e.target;
    const cursorPosition = e.target.selectionStart;

    let data, setData, setShowDropdown, showDropdownArray;
    switch (type) {
      case 'headers':
        data = headers;
        setData = setHeaders;
        setShowDropdown = setShowHeadersDropdown;
        showDropdownArray = showHeadersDropdown;
        break;
      case 'pathVariables':
        data = pathVariables;
        setData = setPathVariables;
        setShowDropdown = setShowPathVariablesDropdown;
        showDropdownArray = showPathVariablesDropdown;
        break;
      case 'queryParameters':
        data = queryParameters;
        setData = setQueryParameters;
        setShowDropdown = setShowQueryParametersDropdown;
        showDropdownArray = showQueryParametersDropdown;
        break;
      case 'cookies':
        data = cookies;
        setData = setCookies;
        setShowDropdown = setShowCookiesDropdown;
        showDropdownArray = showCookiesDropdown;
        break;
      default:
        return;
    }

    const updateState = (data, setData) => {
      const updated = [...data];
      updated[index].value = value;
      setData(updated);
    };

    const nearestStartIndex = value.lastIndexOf('{{', cursorPosition - 1);
    if (nearestStartIndex !== -1) {
      const afterStart = value.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s/);
      const firstEndBraceIndex = afterStart.indexOf('}}');

      if (firstEndBraceIndex !== -1 && (firstSpaceIndex === -1 || firstEndBraceIndex < firstSpaceIndex)) {
        setEnvDropDown([]);
        setShowDropdown(Array(data.length).fill(false));
        updateState(data, setData);
        return;
      }

      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);
      const filteredEnvironments = environment?.filter((env) => env.variable.includes(searchValue)) || [];

      if (filteredEnvironments.length > 0) {
        // 최소값 찾기
        const minValueObject = filteredEnvironments.reduce((min, current) => {
          return current.id < min.id ? current : min;
        });

        // 최소값을 가진 항목을 초기 hover 값으로 설정
        setHoveredEnvIndex(filteredEnvironments.indexOf(minValueObject));
      } else {
        setHoveredEnvIndex(null);
      }

      setEnvDropDown(filteredEnvironments);

      const newShowDropdown = Array(data.length).fill(false);
      newShowDropdown[index] = filteredEnvironments.length > 0;
      setShowDropdown(newShowDropdown);
    } else {
      const newShowDropdown = Array(data.length).fill(false);
      setShowDropdown(newShowDropdown);
      setHoveredEnvIndex(null);
    }

    updateState(data, setData);
  };

  const handleEnvironmentSelect = (selectedVariable, index, type) => {
    let data, setData, setShowDropdown;
    switch (type) {
      case 'headers':
        data = headers;
        setData = setHeaders;
        setShowDropdown = setShowHeadersDropdown;
        break;
      case 'pathVariables':
        data = pathVariables;
        setData = setPathVariables;
        setShowDropdown = setShowPathVariablesDropdown;
        break;
      case 'queryParameters':
        data = queryParameters;
        setData = setQueryParameters;
        setShowDropdown = setShowQueryParametersDropdown;
        break;
      case 'cookies':
        data = cookies;
        setData = setCookies;
        setShowDropdown = setShowCookiesDropdown;
        break;
      default:
        return;
    }

    const updated = [...data];
    const originalValue = updated[index].value;
    const nearestStartIndex = originalValue.lastIndexOf('{{');

    if (nearestStartIndex !== -1) {
      const before = originalValue.slice(0, nearestStartIndex);
      const after = originalValue.slice(nearestStartIndex + 2);

      const firstSpaceIndex = after.indexOf(' ');
      const trimmedAfter = firstSpaceIndex !== -1 ? after.slice(firstSpaceIndex) : '';
      const newValue = `${before}{{${selectedVariable}}} ${trimmedAfter.trimStart()}`;

      updated[index].value = newValue;
      setData(updated);
    }

    const newShowDropdown = Array(data.length).fill(false);
    setShowDropdown(newShowDropdown);
  };

  const renderTable = (title, data, type) => {
    let showDropdown;
    switch (type) {
      case 'headers':
        showDropdown = showHeadersDropdown;
        break;
      case 'pathVariables':
        showDropdown = showPathVariablesDropdown;
        break;
      case 'queryParameters':
        showDropdown = showQueryParametersDropdown;
        break;
      case 'cookies':
        showDropdown = showCookiesDropdown;
        break;
      default:
        return null;
    }

    return (
      <div className='mb-4'>
        <h3 className='font-bold text-sm mb-2'>{title}</h3>
        <table className='w-full border border-gray-300'>
          <thead>
            <tr>
              <th className='py-2 px-4 44 border bg-gray-100 w-[40%]'>Parameter Name</th>
              <th className='py-2 px-4 text-sm border bg-gray-100 w-[60%]'>Value</th>
            </tr>
          </thead>
          <tbody>
            {data && Object.keys(data).length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id} className='hover:bg-gray-50'>
                  <td className='py-2 px-4 text-sm border text-center w-[40%]'>{item.key}</td>
                  <td className='py-2 px-4 border text-center w-[60%]'>
                    <input
                      type='text'
                      value={item.value}
                      onChange={(e) => handleInputChange(e, index, type)}
                      className='w-full text-sm outline-none border-0 p-1 text-center'
                    />
                    {showDropdown[index] && (
                      <>
                        <div className='w-[15%] rounded-bl-lg absolute left-[45%] right-0 bg-white border border-gray-300 mt-1 z-10 h-[150px] overflow-y-scroll sidebar-scrollbar'>
                          {envDropdown.map((env, i) => (
                            <div
                              key={i}
                              onClick={() => handleEnvironmentSelect(env.variable, index, type)}
                              onMouseEnter={() => setHoveredEnvIndex(i)} // hover 시 인덱스를 상태에 저장
                              className='p-2 text-sm hover:bg-gray-100 cursor-pointer'
                            >
                              {env.variable}
                            </div>
                          ))}
                        </div>
                        {hoveredEnvIndex !== null && (
                          <div className='w-[28%] rounded-br-lg absolute left-[60%] right-0 bg-white border border-gray-300 mt-1 z-10 h-[150px]'>
                            <div key={hoveredEnvIndex} className='p-2 text-sm flex flex-col'>
                              <div className='flex flex-col'>
                                {Object.entries(envDropdown[hoveredEnvIndex]).map(([key, value]) => {
                                  if (key !== 'id' && key !== 'orderIndex') {
                                    return (
                                      <div
                                        key={key}
                                        className='flex flex-row dark:text-dark-text text-[#121212] text-start ml-4'
                                      >
                                        <div className='w-[30%] font-semibold'>{key}</div> {value}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className='py-2 px-4 text-sm border text-center'>
                  No Parameters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {renderTable('Headers', headers, 'headers')}
      {renderTable('Path Variables', pathVariables, 'pathVariables')}
      {renderTable('Query Parameters', queryParameters, 'queryParameters')}
      {renderTable('Cookies', cookies, 'cookies')}
    </div>
  );
};

export default ApiTestBody;
