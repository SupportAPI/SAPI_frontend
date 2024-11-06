<<<<<<< HEAD
const Summary = ({ apiName, method, methodStyles, apiUrl, description, params, request, response }) => {
  const { headers = [], authType = 'None', authorization = '', queryParameters = [], cookies = [] } = params;

  const { none = '', json = '', formData = [] } = request;

  // console.log(response);

  console.log('params', params);
=======
const Summary = ({ apiDetail, method, methodStyles, apiUrl, description, params, request, response }) => {
  const { headers = [], authType = 'None', authorization = '', queryParams = [], cookies = [] } = params;

  const { requestType = 'None', jsonData = '', formData = [] } = request;

  const { statusCodes = [], responses = [] } = response;

  console.log(statusCodes);
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240

  return (
    <div className=''>
      <h3 className='text-2xl font-bold'>Summary</h3>
<<<<<<< HEAD
      <p className='text-2xl mt-4 text-[#666666]'>{apiName || 'Enter API name'}</p>
=======
      <p className='text-2xl mt-4 text-[#666666]'>{apiDetail.name || 'Enter API name'}</p>
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
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
<<<<<<< HEAD
      {headers?.length === 0 ? (
=======
      {headers.length === 0 ? (
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
        <p className='text-[#666666]'>No Headers</p>
      ) : (
        headers.map((header, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
<<<<<<< HEAD
            <>
              <p className=''>{header.headerKey} : </p>
              <p className='ml-3'>{header.headerValue}</p>
            </>
=======
            {header.key === 'Authorization' ? (
              <>
                <p className=''>Authorization : </p>
                <p className='ml-3'>{authorization}</p>
              </>
            ) : (
              <>
                <p className=''>{header.key} : </p>
                <p className='ml-3'>{header.value}</p>
              </>
            )}
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
          </div>
        ))
      )}

      {/* Query Parameters */}
      <p className='text-xl text-[#666666] mt-5 mb-2'>Query Parameters</p>
<<<<<<< HEAD
      {queryParameters?.length === 0 ? (
        <p className='text-[#666666]'>No Query parameters</p>
      ) : (
        queryParameters.map((queryParam, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
            <>
              <p className=''>{queryParam.queryParameterKey} : </p>
              <p className='ml-3'>{queryParam.queryParameterValue}</p>
=======
      {queryParams.length === 0 ? (
        <p className='text-[#666666]'>No Query parameters</p>
      ) : (
        queryParams.map((queryParam, index) => (
          <div key={index} className='flex flex-row text-[#666666]'>
            <>
              <p className=''>{queryParam.key} : </p>
              <p className='ml-3'>{queryParam.value}</p>
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
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
<<<<<<< HEAD
              <p className=''>{cookie.cookieKey} : </p>
              <p className='ml-3'>{cookie.cookieValue}</p>
=======
              <p className=''>{cookie.key} : </p>
              <p className='ml-3'>{cookie.value}</p>
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
            </>
          </div>
        ))
      )}

      {/* Request Body */}
      <p className='text-xl text-[#666666] mt-5 mb-2'>Request Body</p>
<<<<<<< HEAD
      {none?.length !== 0 ? (
        <p className='text-[#666666]'>No Request Body</p>
      ) : json?.length !== 0 ? (
        <>
          <p className='text-lg text-[#666666] mb-2'>Request Type : JSON </p>
          <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
            {json}
=======
      {requestType === 'none' ? (
        <p className='text-[#666666]'>No Request Body</p>
      ) : requestType === 'json' ? (
        <>
          <p className='text-lg text-[#666666] mb-2'>Request Type : JSON </p>
          <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
            {jsonData}
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
          </div>
        </>
      ) : (
        formData.map((formData, index) => (
          <>
            <p className='text-lg text-[#666666] mb-2'>Request Type : Form-Data </p>
            <div key={index} className='flex flex-row text-[#666666]'>
              <>
<<<<<<< HEAD
                <p className=''>{formData.formDataKey} : </p>
                <p className='ml-3'>{formData.formDataValue}</p>
              </>
=======
                <p className=''>{formData.key} : </p>
                <p className='ml-3'>{formData.value}</p>
              </>
            </div>
          </>
        ))
      )}
      <p className='text-2xl mt-5 text-[#666666]'>Response</p>
      <hr className='border-t border-gray-300 mb-3' />

      {/* Response */}
      {statusCodes.length === 0 ? (
        <p className='text-[#666666]'>No Response</p>
      ) : (
        statusCodes.map((code, index) => (
          <>
            <p className='text-xl text-[#666666] mt-5 mb-2'>{code}</p>
            <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
              {responses[code]}
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
            </div>
          </>
        ))
      )}
<<<<<<< HEAD
      <p className='text-2xl mt-5 text-[#666666]'>Response</p>
      <hr className='border-t border-gray-300 mb-3' />

      {/* Response */}
      {/* {statusCodes.length === 0 ? (
        <p className='text-[#666666]'>No Response</p>
      ) : (
        statusCodes.map((code, index) => (
          <>
            <p className='text-xl text-[#666666] mt-5 mb-2'>{code}</p>
            <div className='text-[#666666] bg-gray-100 p-2 rounded-md' style={{ whiteSpace: 'pre-wrap' }}>
              {responses[code]}
            </div>
          </>
        ))
      )} */}
=======
>>>>>>> 5a923362ab44d73e8480e6a726977719d29f5240
    </div>
  );
};

export default Summary;
