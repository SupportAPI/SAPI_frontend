const Summary = ({ apiName, method, methodStyles, apiUrl, description, params, request, response }) => {
  const { headers = [], authType = 'None', queryParameters = [], cookies = [] } = params;

  console.log(params);
  const { bodyType = 'None', json = [], formData = [] } = request;
  const { responses = {}, statusCodes = {} } = response;

  return (
    <div className=''>
      <h3 className='text-2xl font-bold'>Summary</h3>
      <p className='text-2xl mt-4 text-[#666666]'>{apiName || 'Enter API name'}</p>
      <div className='flex flex-row justify-content items-center'>
        <p
          className={`my-2 ${methodStyles[method]} border border-gray-300 p-2 
          rounded-md w-20 text-center text-[#666666]`}
        >
          {method}
        </p>
        <p className='my-2 ml-2 text-xl text-[#666666]'>{apiUrl || 'No URL provided'}</p>
      </div>
      <p className='mt-3 text-[#666666]'>Description: {description || 'No description available'}</p>
      <p className='text-2xl mt-5 text-[#666666]'>Request</p>
      <hr className='border-t border-gray-300 mb-3' />

      {/* headers */}
      <p className='text-xl text-[#666666] mb-2'>Headers</p>
      {headers?.length === 0 ? (
        <p className='text-[#666666]'>No Headers</p>
      ) : (
        headers.map((header, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
            <>
              <p className=''>{header.headerKey} : </p>
              <p className='ml-3'>{header.headerValue}</p>
            </>
          </div>
        ))
      )}

      {/* Query Parameters */}
      <p className='text-xl text-[#666666] mt-5 mb-2'>Query Parameters</p>
      {queryParameters?.length === 0 ? (
        <p className='text-[#666666]'>No Query parameters</p>
      ) : (
        queryParameters.map((queryParam, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
            <>
              <p className=''>{queryParam.queryParameterKey} : </p>
              <p className='ml-3'>{queryParam.queryParameterValue}</p>
            </>
          </div>
        ))
      )}

      {/* Cookies */}
      <p className='text-xl text-[#666666] mt-5 mb-2'>Cookies</p>
      {cookies.length === 0 ? (
        <p className='text-[#666666]'>No cookies</p>
      ) : (
        cookies.map((cookie, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
            <>
              <p className=''>{cookie.cookieKey} : </p>
              <p className='ml-3'>{cookie.cookieValue}</p>
            </>
          </div>
        ))
      )}

      {/* Request Body */}
      <p className='text-xl text-[#666666] mt-5 mb-2'>Request Body</p>
      {bodyType === 'NONE' ? (
        <p className='text-[#666666]'>No Request Body</p>
      ) : bodyType === 'JSON' ? (
        <>
          <p className='text-lg text-[#666666] mb-2'>Request Type : JSON </p>
          <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
            <p className=''>{json.jsonDataKey} : </p>
            <p className='ml-3'>{json.jsonDataValue}</p>
          </div>
        </>
      ) : (
        formData.map((formData, index) => (
          <>
            <p className='text-lg text-[#666666] mb-2'>Request Type : Form-Data </p>
            <div key={index} className='flex flex-row text-[#666666]'>
              <>
                <p className=''>{formData.formDataKey} : </p>
                <p className='ml-3'>{formData.formDataValue}</p>
              </>
            </div>
          </>
        ))
      )}
      <p className='text-2xl mt-5 text-[#666666]'>Response</p>
      <hr className='border-t border-gray-300 mb-3' />

      {/* Response */}
      {response?.length === 0 ? (
        <p className='text-[#666666]'>No Response</p>
      ) : (
        statusCodes?.map((code, index) => (
          <>
            <p className='text-xl text-[#666666] mt-5 mb-2'>{code}</p>
            <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
              {responses[code]}
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default Summary;
