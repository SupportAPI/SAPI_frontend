import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

const RightSectionCodeSnippet = ({ path, method, parameters, request }) => {
  const [library, setLibrary] = useState('axios'); // 기본값을 'axios'로 설정
  const { workspaceId } = useParams();

  console.log(request.json.value);

  const headerValue = parameters.headers?.[0]?.headerValue || 'application/json';

  const url = `https://k11b305.p.ssafy.io/proxy/${workspaceId}/dynamic`;

  const snippets = {
    axios: `
    axios.${method.toLowerCase()}(\`${url}${path}\`, 
      ${request.json.value}, 
      {
        headers: {
          'Content-Type': '${headerValue}',
        },
      });
    `,
    fetch: `
    fetch(\`${url}${path}\`, {
      method: '${method.toLowerCase()}',
      headers: {
        'Content-Type': '${headerValue}',
      },
      body: JSON.stringify(${request.json.value}),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    `,
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast('클립보드에 복사되었습니다!');
  };

  return (
    <div className=''>
      <h3 className='text-lg font-bold mb-4'>API 코드 스니펫</h3>

      {/* axios와 fetch 선택 버튼 */}
      <div className='flex items-center space-x-4 mb-6'>
        <button
          onClick={() => setLibrary('axios')}
          className={`p-3 rounded-full ${
            library === 'axios' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:text-black'
          }`}
        >
          Axios
        </button>
        <button
          onClick={() => setLibrary('fetch')}
          className={`p-3 rounded-full ${
            library === 'fetch' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:text-black'
          }`}
        >
          Fetch
        </button>
      </div>

      {/* 코드 스니펫 영역 */}
      <div className='mb-4 relative group'>
        <span className='text-sm font-semibold mb-2'>{library.toUpperCase()}</span>
        <div
          className='border border-gray-300 rounded-md p-4 relative bg-white'
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <Editor
            height='300px'
            defaultLanguage='javascript'
            value={snippets[library]}
            options={{
              readOnly: true,
              domReadOnly: true,
              minimap: { enabled: false },
              lineNumbers: 'off',
              renderLineHighlight: 'none',
              occurrencesHighlight: false,
              selectionHighlight: false,
              wordWrap: 'on',
              overviewRulerLanes: 0,
              scrollbar: {
                horizontal: 'hidden',
                vertical: 'hidden',
              },
            }}
            theme='vs-light'
          />

          <button
            onClick={() => copyToClipboard(snippets[library])}
            className='absolute top-2 right-2 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            style={{ pointerEvents: 'auto' }}
          >
            <FiCopy size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSectionCodeSnippet;
