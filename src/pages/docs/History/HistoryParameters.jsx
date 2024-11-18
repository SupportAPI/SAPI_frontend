const HistoryParameters = ({ initialValues = {} }) => {
  const { authType = 'No Auth', headers = [], cookies = [], pathVariables = [], queryParameters = [] } = initialValues;

  return (
    <div>
      <div className='mb-4'>
        <label className='flex items-center text-[16px] font-semibold h-8'>Auth Type</label>
        <div className='w-[250px] text-[14px] rounded-sm flex items-center text-center px-3 py-2 relative h-10 border'>
          {authType}
        </div>
        <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>Headers</label>
        {headers.length > 0 ? (
          <div className=''>
            <div className='flex h-10 rounded-sm text-[14px] border bg-[#f1f5f8]'>
              <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
            </div>
            {headers
              .slice() // 원본 배열을 변경하지 않기 위해 복사
              .sort((a, b) => {
                // Authorization 헤더를 맨 앞으로 이동
                if (a.key === 'Authorization') return -1;
                if (b.key === 'Authorization') return 1;
                return 0;
              })
              .map((header, index) => {
                const isAuthorizationHeader = header.key === 'Authorization';
                return (
                  <div
                    key={index}
                    className={`flex h-10 mt-1 rounded-sm text-[14px] border ${
                      isAuthorizationHeader ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <div className='flex-[0.4] h-10 p-2 border-r'>{header.isRequired ? 'required' : 'optional'}</div>
                    <div className='flex-1 h-10 p-2 border-r'>{header.key}</div>
                    <div className='flex-1 h-10 p-2 border-r'>{header.value}</div>
                    <div className='flex-1 h-10 p-2 border-r'>{header.description}</div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div>No Headers</div>
        )}
        <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>Query Parameters</label>
        {queryParameters.length > 0 ? (
          <div className=''>
            <div className='flex h-10 rounded-sm text-[14px] border bg-[#f1f5f8]'>
              <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
            </div>
            {queryParameters.map((queryParameter, index) => {
              return (
                <div key={index} className={`flex h-10 mt-1 rounded-sm text-[14px] border bg-white`}>
                  <div className='flex-[0.4] h-10 p-2 border-r'>
                    {queryParameter.isRequired ? 'required' : 'optional'}
                  </div>
                  <div className='flex-1 h-10 p-2 border-r'>{queryParameter.key}</div>
                  <div className='flex-1 h-10 p-2 border-r'>{queryParameter.value}</div>
                  <div className='flex-1 h-10 p-2 border-r'>{queryParameter.description}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No Query Parameters</div>
        )}
        <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>Cookies</label>
        {cookies.length > 0 ? (
          <div className=''>
            <div className='flex h-10 rounded-sm text-[14px] border bg-[#f1f5f8]'>
              <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
              <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
            </div>
            {cookies.map((cookie, index) => {
              return (
                <div key={index} className={`flex h-10 mt-1 rounded-sm text-[14px] border bg-white`}>
                  <div className='flex-[0.4] h-10 p-2 border-r'>{cookie.isRequired ? 'required' : 'optional'}</div>
                  <div className='flex-1 h-10 p-2 border-r'>{cookie.key}</div>
                  <div className='flex-1 h-10 p-2 border-r'>{cookie.value}</div>
                  <div className='flex-1 h-10 p-2 border-r'>{cookie.description}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No Cookies</div>
        )}
      </div>
    </div>
  );
};

export default HistoryParameters;
