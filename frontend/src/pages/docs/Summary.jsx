const Summary = ({ apiDetail, method, methodStyles, apiUrl, description }) => (
  <div>
    <h3 className='text-lg font-bold'>Summary</h3>
    <p className='font-semibold'>{apiDetail.name || 'Enter API name'}</p>
    <p
      className={`my-2 ${methodStyles[method]}`}
      style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '100px' }}
    >
      {method}
    </p>
    <p className='my-2'>URL: {apiUrl || 'No URL provided'}</p>
    <p>Description: {description || 'No description available'}</p>
  </div>
);

export default Summary;
