const RightSectionSummary = ({ apiDocDetail, methodStyles }) => {
  const { headers = [], authType = 'None', queryParameters = [], cookies = [] } = apiDocDetail.parameters;

  console.log(apiDocDetail);

  console.log(apiDocDetail.parameters);
  const { bodyType = 'None', json = [], formData = [] } = apiDocDetail.request;

  return (
    <div className=''>
      <h3 className='text-2xl font-bold'>Summary</h3>
      <p className='text-2xl mt-4 text-[#666666] dark:text-dark-text'>{apiDocDetail?.name || 'Enter API name'}</p>
      <div className='flex flex-row justify-content items-center'>
        <p
          className={`my-2 ${methodStyles[apiDocDetail.method]} border border-gray-300 p-2 
          rounded-md w-20 text-center text-[#666666] dark:text-dark-text`}
        >
          {apiDocDetail.method}
        </p>
        <p className='my-2 ml-2 text-xl text-[#666666] dark:text-dark-text'>{apiDocDetail.path || 'No URL provided'}</p>
      </div>
      <p className='mt-3 text-[#666666] dark:text-dark-text'>
        Description: {apiDocDetail.description || 'No description available'}
      </p>
      <p className='text-2xl mt-5 text-[#666666] dark:text-dark-text'>Request</p>
      <hr className='border-t border-gray-300 mb-3' />
      {/* headers */}
      <p className='text-xl text-[#666666] dark:text-dark-text mb-2'>Headers</p>
      {headers?.length === 0 ? (
        <p className='text-[#666666] dark:text-dark-text'>No Headers</p>
      ) : (
        headers.map((header, index) => (
          <div key={index} className='flex flex-row text-[#666666] dark:text-dark-text'>
            <>
              <p className=''>{header.key} : </p>
              <p className='ml-3'>{header.value}</p>
            </>
          </div>
        ))
      )}
      {/* Query Parameters */}
      <p className='text-xl text-[#666666] dark:text-dark-text mt-5 mb-2'>Query Parameters</p>
      {queryParameters?.length === 0 ? (
        <p className='text-[#666666] dark:text-dark-text'>No Query parameters</p>
      ) : (
        queryParameters.map((queryParam, index) => (
          <div key={index} className='flex flex-row text-[#666666] dark:text-dark-text'>
            <>
              <p className=''>{queryParam.key} : </p>
              <p className='ml-3'>{queryParam.value}</p>
            </>
          </div>
        ))
      )}
      {/* Cookies */}
      <p className='text-xl text-[#666666] dark:text-dark-text mt-5 mb-2'>Cookies</p>
      {cookies.length === 0 ? (
        <p className='text-[#666666] dark:text-dark-text'>No cookies</p>
      ) : (
        cookies.map((cookie, index) => (
          <div key={index} className='flex flex-row text-[#666666] dark:text-dark-text'>
            <>
              <p className=''>{cookie.key} : </p>
              <p className='ml-3'>{cookie.value}</p>
            </>
          </div>
        ))
      )}
      {/* Request Body */}
      <p className='text-lg text-[#666666] dark:text-dark-text mt-5 mb-2'>Request Body : {bodyType}</p>
      {bodyType === 'NONE' ? (
        <p className='text-[#666666] dark:text-dark-text'>No Request Body</p>
      ) : bodyType === 'JSON' ? (
        <>
          <div
            className='text-[#666666] dark:text-dark-text bg-gray-100 p-2 rounded-md'
            style={{ whiteSpace: 'pre-wrap' }}
          >
            <p className='ml-3'>{json.value}</p>
          </div>
        </>
      ) : (
        <table className='w-full border border-gray-300'>
          <thead>
            <tr>
              <th className='py-2 px-4 text-sm border bg-gray-100'>Requirement</th>
              <th className='py-2 px-4 text-sm border bg-gray-100'>Key</th>
              <th className='py-2 px-4 text-sm border bg-gray-100'>Value</th>
              <th className='py-2 px-4 text-sm border bg-gray-100'>Description</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((item, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='py-2 px-4 text-sm border text-center'>{item.isRequired ? 'Required' : 'Optional'}</td>
                <td className='px-4 py-2 text-sm flex items-center border justify-between'>
                  <div>{item.key}</div>
                  <div className='w-[55px] bg-white border text-center'>{item.type}</div>
                </td>
                <td className='py-2 px-4 text-sm border text-center'>{item.value}</td>
                <td className='py-2 px-4 text-sm border text-center'>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className='text-2xl mt-5 text-[#666666] dark:text-dark-text'>Response</p>
      <hr className='border-t border-gray-300 mb-3' />
      {/* Response */}
      {apiDocDetail.response?.length === 0 ? (
        <p className='text-[#666666] dark:text-dark-text'>No Response</p>
      ) : (
        apiDocDetail.response?.map((response, index) => (
          <>
            <p className='text-xl text-[#666666] dark:text-dark-text mt-5 mb-2'>{response.code}</p>
            <div
              className='text-[#666666] dark:text-dark-text bg-gray-100 p-2 rounded-md'
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {response.bodyData}
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default RightSectionSummary;
