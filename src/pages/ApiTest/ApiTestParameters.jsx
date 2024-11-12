import { useState, useEffect } from 'react';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';

const ApiTestBody = ({ initialValues, paramsChange }) => {
  // State로 데이터를 관리하여 사용자 수정 가능
  const [headers, setHeaders] = useState(initialValues?.headers || []);
  const [pathVariables, setPathVariables] = useState(initialValues?.pathVariables || []);
  const [queryParameters, setQueryParameters] = useState(initialValues?.queryParameters || []);
  const [cookies, setCookies] = useState(initialValues?.cookies || []);
  const [authType, setAuthType] = useState(initialValues?.authType || 'None');

  const { environment, setEnvironment } = useEnvironmentStore();
  const [envDropdown, setEnvDropDown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    paramsChange({
      headers,
      pathVariables,
      queryParameters,
      cookies,
      authType,
    });
  }, [headers, pathVariables, queryParameters, cookies, authType]);

  // 입력값 변경 핸들러
  const handleInputChange = (e, index, type) => {
    const { value } = e.target;
    const cursorPosition = e.target.selectionStart; // 현재 커서 위치

    const updateState = (data, setData) => {
      const updated = [...data];
      updated[index].value = value;
      setData(updated);
    };

    // 커서 위치 기준으로 가장 가까운 `{{`의 위치를 찾기
    const nearestStartIndex = value.lastIndexOf('{{', cursorPosition - 1);
    if (nearestStartIndex !== -1) {
      // `{{` 이후 텍스트에서 띄어쓰기 전까지 추출
      const afterStart = value.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/); // 공백이나 `}}`를 찾기
      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);

      setEnvDropDown(environment?.filter((env) => env.value.startsWith(searchValue)));

      // 필터링 결과를 드롭다운 형태로 표시하는 로직 (생략)
      // 예: `filteredEnvironments`를 기반으로 드롭다운 생성 및 표
    }

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

  useEffect(() => {
    if (envDropdown) {
      setShowDropdown(true);
    }
  }, [envDropdown]);

  // 드롭다운에서 환경 변수를 선택한 경우 value 업데이트 로직
  const handleEnvironmentSelect = (selectedVariable, index, type) => {
    const updateState = (data, setData) => {
      const updated = [...data];
      const originalValue = updated[index].value;

      // `{{` 이후 텍스트에서 띄어쓰기 전까지의 범위를 찾음
      const nearestStartIndex = originalValue.lastIndexOf('{{', cursorPosition - 1);
      if (nearestStartIndex !== -1) {
        const afterStart = originalValue.slice(nearestStartIndex + 2);
        const firstSpaceIndex = afterStart.search(/\s|}}/);
        const endIndex = firstSpaceIndex === -1 ? originalValue.length : nearestStartIndex + 2 + firstSpaceIndex;

        // 앞부분, 중간에 삽입할 부분, 뒷부분 나누기
        const newValue =
          originalValue.slice(0, nearestStartIndex) + `{{${selectedVariable}}}` + originalValue.slice(endIndex);

        updated[index].value = newValue;
        setData(updated);
      }

      setShowDropdown(false); // 드롭다운 닫기
    };

    // 상태 업데이트
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
                {showDropdown && (
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
      {headers.length > 0 && renderTable('Headers', headers, 'headers')}
      {pathVariables.length > 0 && renderTable('Path Variables', pathVariables, 'pathVariables')}
      {queryParameters.length > 0 && renderTable('Query Parameters', queryParameters, 'queryParameters')}
      {cookies.length > 0 && renderTable('Cookies', cookies, 'cookies')}
    </div>
  );
};

export default ApiTestBody;
