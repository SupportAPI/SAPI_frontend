const CodeSnippet = ({
  apiUrl,
  method,
  headers,
  pathVariables,
  body,
  queryParams,
  httpClient = 'fetch', // 'fetch' 기본값
  framework = 'react', // 'react' 기본값
}) => {
  // Path Variable과 Query Params를 포함한 최종 URL 생성
  const fullUrl = `${apiUrl.replace(/:\w+/g, (match) => pathVariables[match.slice(1)] || match)}${
    queryParams ? '?' + new URLSearchParams(queryParams).toString() : ''
  }`;

  const fetchCode = `
fetch('${fullUrl}', {
  method: '${method}',${headers ? `\n  headers: ${JSON.stringify(headers)},` : ''}
  ${body ? `body: JSON.stringify(${JSON.stringify(body)})` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
  `;

  const axiosCode = `
axios.${method.toLowerCase()}('${fullUrl}'${body ? `, ${JSON.stringify(body)}` : ''}, {
  ${headers ? `headers: ${JSON.stringify(headers)}` : ''}
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
  `;

  // HTTP 클라이언트 선택에 따른 코드 생성
  const codeSnippet = httpClient === 'axios' ? axiosCode : fetchCode;

  return (
    <div>
      <h4 className='font-bold'>
        Code Snippet ({framework.toUpperCase()} with {httpClient.toUpperCase()})
      </h4>
      <pre className='bg-gray-100 p-2 rounded'>
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
};

export default CodeSnippet;
