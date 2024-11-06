import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FaReact } from 'react-icons/fa';
import { SiVuedotjs, SiNextdotjs } from 'react-icons/si';
import { FiCopy } from 'react-icons/fi';

const CodeSnippet = ({ url, path, method, parameters }) => {
  const [framework, setFramework] = useState('react'); // 기본값은 'react'

  const snippets = {
    react: {
      axios: `
axios.${method.toLowerCase()}(\`\${url}/${path}\`, {
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
});
      `,
      fetch: `
fetch(\`\${url}/${path}\`, {
  method: '${method}',
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
      `,
    },
    vue: {
      axios: `
this.$axios.${method.toLowerCase()}(\`\${url}/${path}\`, {
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
});
      `,
      fetch: `
fetch(\`\${url}/${path}\`, {
  method: '${method}',
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
      `,
    },
    next: {
      axios: `
import axios from 'axios';

axios.${method.toLowerCase()}(\`\${url}/${path}\`, {
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
});
      `,
      fetch: `
import fetch from 'node-fetch';

fetch(\`\${url}/${path}\`, {
  method: '${method}',
  headers: {
    'Content-Type': '${parameters.headers[0].headerValue}',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
      `,
    },
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('코드가 클립보드에 복사되었습니다!');
  };

  return (
    <div>
      <h3 className='text-lg font-bold mb-4'>API 코드 스니펫</h3>

      {/* 프레임워크 선택 아이콘 */}
      <div className='flex items-center space-x-4 mb-6'>
        <button
          onClick={() => setFramework('react')}
          className={`p-3 rounded-full ${framework === 'react' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          title='React'
        >
          <FaReact size={24} />
        </button>
        <button
          onClick={() => setFramework('vue')}
          className={`p-3 rounded-full ${framework === 'vue' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          title='Vue'
        >
          <SiVuedotjs size={24} />
        </button>
        <button
          onClick={() => setFramework('next')}
          className={`p-3 rounded-full ${framework === 'next' ? 'bg-black text-white' : 'bg-gray-200'}`}
          title='Next.js'
        >
          <SiNextdotjs size={24} />
        </button>
      </div>

      {/* Axios 코드 스니펫 */}
      <div className='mb-4 relative group'>
        <span className='text-sm font-semibold mb-2'>Axios</span>
        <div
          className='border border-gray-300 rounded-md p-4 relative'
          style={{ pointerEvents: 'none', userSelect: 'none' }} // 선택 방지
        >
          <Editor
            height='200px'
            defaultLanguage='javascript'
            value={snippets[framework].axios}
            options={{
              readOnly: true,
              domReadOnly: true,
              minimap: { enabled: false },
              lineNumbers: 'off',
              renderLineHighlight: 'none',
              occurrencesHighlight: false,
              selectionHighlight: false,
              wordWrap: 'on',
              scrollbar: {
                horizontal: 'hidden', // 가로 스크롤바 숨기기
                vertical: 'hidden', // 세로 스크롤바 숨기기
              },
            }}
            theme='vs-light' // 밝은 테마 설정
          />
          <button
            onClick={() => copyToClipboard(snippets[framework].axios)}
            className='absolute top-2 right-2 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            style={{ pointerEvents: 'auto' }} // 복사 버튼은 클릭 가능
          >
            <FiCopy size={18} />
          </button>
        </div>
      </div>

      {/* Fetch 코드 스니펫 */}
      <div className='relative group'>
        <span className='text-sm font-semibold mb-2'>Fetch</span>
        <div
          className='border border-gray-300 rounded-md p-4 relative'
          style={{ pointerEvents: 'none', userSelect: 'none' }} // 선택 방지
        >
          <Editor
            height='200px'
            defaultLanguage='javascript'
            value={snippets[framework].fetch}
            options={{
              readOnly: true,
              domReadOnly: true,
              minimap: { enabled: false },
              lineNumbers: 'off',
              renderLineHighlight: 'none',
              occurrencesHighlight: false,
              selectionHighlight: false,
              wordWrap: 'on',
              scrollbar: {
                horizontal: 'hidden', // 가로 스크롤바 숨기기
                vertical: 'hidden', // 세로 스크롤바 숨기기
              },
            }}
            theme='vs-light' // 밝은 테마 설정
          />
          <button
            onClick={() => copyToClipboard(snippets[framework].fetch)}
            className='absolute top-2 right-2 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            style={{ pointerEvents: 'auto' }} // 복사 버튼은 클릭 가능
          >
            <FiCopy size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;
