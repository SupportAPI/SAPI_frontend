import { useState, useEffect, useCallback } from 'react';
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

  // useEffect(() => {
  //   if (initialValues) {
  //     setHeaders(initialValues?.headers || []);
  //     setPathVariables(initialValues?.pathVariables || []);
  //     setQueryParameters(initialValues?.queryParameters || []);
  //     setCookies(initialValues?.cookies || []);
  //     setAuthType(initialValues?.authType || 'None');
  //   }
  // }, [initialValues]);

  // `paramsChange`를 메모이제이션하여 변경사항이 있을 때만 호출
  // const updateParams = useCallback(() => {
  //   paramsChange({
  //     headers,
  //     pathVariables,
  //     queryParameters,
  //     cookies,
  //     authType,
  //   });
  // }, [headers, pathVariables, queryParameters, cookies, authType, paramsChange]);

  // useEffect(() => {
  //   updateParams();
  // }, [updateParams]);

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
        return;
      }

      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);
      const filteredEnvironments = environment?.filter((env) => env.value.startsWith(searchValue)) || [];
      setEnvDropDown(filteredEnvironments);

      const newShowDropdown = Array(data.length).fill(false);
      newShowDropdown[index] = filteredEnvironments.length > 0;
      setShowDropdown(newShowDropdown);
    } else {
      const newShowDropdown = Array(data.length).fill(false);
      setShowDropdown(newShowDropdown);
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

    const updateState = (data, setData) => {
      const updated = [...data];
      const originalValue = updated[index].value;
      const nearestStartIndex = originalValue.lastIndexOf('{{');

      if (nearestStartIndex !== -1) {
        const afterStart = originalValue.slice(nearestStartIndex + 2);
        const firstSpaceIndex = afterStart.search(/\s|}}/);
        const endIndex = firstSpaceIndex === -1 ? originalValue.length : nearestStartIndex + 2 + firstSpaceIndex;
        const newValue =
          originalValue.slice(0, nearestStartIndex) + `{{${selectedVariable}}}` + originalValue.slice(endIndex);

        updated[index].value = newValue;
        setData(updated);
      }

      const newShowDropdown = Array(data.length).fill(false);
      setShowDropdown(newShowDropdown);
    };

    updateState(data, setData);
  };

  const renderTable = (title, data, type, showDropdown) => (
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
                {showDropdown[index] && (
                  <div className='absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10'>
                    {envDropdown.map((env, i) => (
                      <div
                        key={i}
                        onClick={() => handleEnvironmentSelect(env.variable, index, type)}
                        className='p-2 text-sm hover:bg-gray-100 cursor-pointer'
                      >
                        {env.variable}
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {headers.length > 0 && renderTable('Headers', headers, 'headers', showHeadersDropdown)}
      {pathVariables.length > 0 &&
        renderTable('Path Variables', pathVariables, 'pathVariables', showPathVariablesDropdown)}
      {queryParameters.length > 0 &&
        renderTable('Query Parameters', queryParameters, 'queryParameters', showQueryParametersDropdown)}
      {cookies.length > 0 && renderTable('Cookies', cookies, 'cookies', showCookiesDropdown)}
    </div>
  );
};

export default ApiTestBody;
