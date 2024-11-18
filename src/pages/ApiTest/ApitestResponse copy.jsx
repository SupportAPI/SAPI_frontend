import { useEffect, useState } from 'react';

const ApiTestResponse = ({ initialData }) => {
  const [activeTabResult, setActiveTabResult] = useState('Body');
  const statusCodeColors = {
    success: 'bg-[#BFE395] text-[#5CAD00]', // 200번대
    redirect: 'bg-[#B0EFF6] text-[#00B2C6]', // 300번대
    clientError: 'bg-[#F9D1A0] text-[#E17C00]', // 400번대
    serverError: 'bg-[#FCC1C1] text-[#C04242]', // 500번대
    default: 'bg-[#C3C3C3] text-[#7A7A7A]', // 기타
  };
  const [showSizeDropdown, setShowSizeDropDown] = useState(false);
  const [resultData, setResultData] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setResultData(initialData);
    }
  }, [initialData]);

  const getColorForStatusCode = (code) => {
    if (code >= 200 && code < 300) return statusCodeColors.success;
    if (code >= 300 && code < 400) return statusCodeColors.redirect;
    if (code >= 400 && code < 500) return statusCodeColors.clientError;
    if (code >= 500 && code < 600) return statusCodeColors.serverError;
    return statusCodeColors.default;
  };

  const getTotalSize = (responseSize) => {
    const bodySize = parseInt(responseSize?.Body.split(' ')[0]) || 0;
    const headersSize = parseInt(responseSize?.Headers.split(' ')[0]) || 0;
    return bodySize + headersSize;
  };

  // Result Tab
  const renderTabResult = () => {
    switch (activeTabResult) {
      case 'Body': {
        let parsedBody;
        try {
          parsedBody = JSON.parse(resultData.responseBody);
        } catch (error) {
          parsedBody = resultData.responseBody;
        }

        let parsedMockBody;
        try {
          parsedMockBody = JSON.parse(resultData.mockBody);
        } catch (error) {
          parsedMockBody = resultData.mockBody;
        }

        return (
          <div className='flex'>
            <div className='flex flex-col w-[50%]'>
              <p className='text-xl ml-1 mb-1'>MY RESPONSE</p>
              <div className='border w-[50%] p-4'>
                <pre className='overflow-x'>{parsedBody ? JSON.stringify(parsedBody, null, 2) : 'No data'}</pre>
              </div>
            </div>
            <div className='flex flex-col w-[50%]'>
              <p className='text-xl ml-1 mb-1'>MOCK RESPONSE</p>
              <div className='border w-[50%] p-4'>
                <pre className='overflow-x'>{parsedMockBody ? JSON.stringify(parsedMockBody, null, 2) : 'No data'}</pre>
              </div>
            </div>
          </div>
        );
      }
      case 'Cookies': {
        return (
          <>
            <div className='flex flex-col items-center'>
              <div className='w-[100%] flex h-10 text-[14px] border bg-[#f1f5f8]'>
                <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
              </div>
              {resultData?.cookies && Object.keys(resultData.cookies).length > 0 ? (
                Object.entries(resultData.cookies).map(([key, value], index) => (
                  <div className='w-[100%] flex border mt-1' key={index}>
                    <div className='flex-1 p-2 border-r'>{key || 'N/A'}</div>
                    <div className='flex-1 p-2'>{value || 'N/A'}</div>
                  </div>
                ))
              ) : (
                <div className='flex w-full border-x border-b p-2'>
                  <div className='w-full text-[16px] text-center'>No header Data</div>
                </div>
              )}
            </div>
          </>
        );
      }
      case 'Headers': {
        return (
          <div className='flex flex-col items-center'>
            <div className='w-[100%] flex h-10 text-[14px] border bg-[#f1f5f8]'>
              <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
            </div>
            {resultData?.headers && Object.keys(resultData.headers).length > 0 ? (
              Object.entries(resultData.headers).map(([key, value], index) => (
                <div className='w-[100%] flex border mt-1' key={index}>
                  <div className='flex-1 p-2 border-r'>{key || 'N/A'}</div>
                  <div className='flex-1 p-2'>{value || 'N/A'}</div>
                </div>
              ))
            ) : (
              <div className='flex w-full border-x border-b p-2'>
                <div className='w-full text-[16px] text-center'>No header Data</div>
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      {/* 테스트 결과 영역 */}
      <div className='p-4 overflow-y-auto sidebar-scrollbar h-[400px]'>
        {/* 탭 네비게이션 */}
        <div className='flex mb-4 justify-between'>
          <div className='flex flex-row'>
            <button
              className={`w-[60px] mr-3 mb-1 text-[13px] ${
                activeTabResult === 'Body' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTabResult('Body')}
            >
              Body
            </button>
            <button
              className={`w-[60px] mr-3 mb-1 text-[13px] ${
                activeTabResult === 'Cookies' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTabResult('Cookies')}
            >
              Cookies
            </button>
            <button
              className={`w-[60px] mr-3 mb-1 text-[13px] ${
                activeTabResult === 'Headers' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTabResult('Headers')}
            >
              Headers
            </button>
          </div>
          <div className='flex flex-row mr-2'>
            {/* 상태 코드에 따른 배경색 적용 */}
            <div
              className={`w-[110px] text-center mr-3 mb-1 text-[13px] text-white rounded p-1 ${getColorForStatusCode(
                resultData?.code
              )}`}
            >
              {resultData?.code} {resultData?.status}
            </div>
            <div className='w-[50px] text-center text-[13px] mr-3 mb-1 mt-1'>{resultData?.responseTime} ms</div>
            <div
              className='w-[50px] text-center text-[13px] mr-3 mb-1 mt-1 relative'
              onMouseEnter={() => setShowSizeDropDown(true)}
              onMouseLeave={() => setShowSizeDropDown(false)}
            >
              {getTotalSize(resultData?.responseSize)} B
              {showSizeDropdown && (
                <div
                  className='absolute border p-2 bg-white w-[180px] rounded z-10'
                  style={{ left: '-120px', top: `+30px` }}
                >
                  <div className='flex flex-col border-b border-gray-300 p-2'>
                    <div>
                      <div className='font-bold text-sm flex flex-row justify-between'>
                        <div>Response Size</div>
                        {getTotalSize(resultData?.responseSize)} B
                      </div>
                      <div className='p-1 flex flex-row justify-between'>
                        <div>Headers</div>
                        {resultData?.responseSize?.Headers || 0}
                      </div>
                      <div className='p-1 flex flex-row justify-between'>
                        <div>Body</div>
                        {resultData?.responseSize?.Body || 0}
                      </div>
                    </div>
                  </div>
                  <div className='p-2'>
                    <div>
                      <div className='font-bold text-sm flex flex-row justify-between'>
                        <div>Request Size</div>
                        {getTotalSize(resultData?.requestSize)} B
                      </div>
                      <div className='p-1 flex flex-row justify-between'>
                        <div>Headers</div>
                        {resultData?.requestSize?.Headers || 0}
                      </div>
                      <div className='p-1 flex flex-row justify-between'>
                        <div>Body</div>
                        {resultData?.requestSize?.Body || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='p-4 overflow-y-auto sidebar-scrollbar text-[13px]'>{renderTabResult()}</div>
      </div>
    </>
  );
};

export default ApiTestResponse;
