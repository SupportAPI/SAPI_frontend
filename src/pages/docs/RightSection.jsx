import { useState } from 'react';
import { FiCode, FiFileText, FiMessageSquare, FiInfo, FiX } from 'react-icons/fi';
import Summary from './Summary';
import CodeSnippet from './CodeSnippet';
import Comments from './Comments';
import Info from './Info';

const RightSection = ({ apiDocDetail, apiId, workspaceId }) => {
  const [activeRightTab, setActiveRightTab] = useState(null);

  const methodStyles = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-orange-500',
    PATCH: 'text-purple-500',
    DELETE: 'text-red-500',
    HEAD: 'text-gray-500',
    OPTIONS: 'text-yellow-500',
  };

  const toggleRightTab = (tab) => {
    setActiveRightTab(activeRightTab === tab ? null : tab);
  };

  return (
    <>
      <div
        className={`transition-width duration-300 p-8 mr-[50px] relative overflow-y-auto ${
          activeRightTab ? 'w-[500px] min-w-[500px] max-w-[500px]' : 'w-[350px] min-w-[350px] max-w-[350px]'
        } ${activeRightTab ? 'border-l' : ''} sidebar-scrollbar h-[775px] pb-5`}
      >
        {activeRightTab && (
          <button
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
            onClick={() => setActiveRightTab(null)}
          >
            <FiX size={20} />
          </button>
        )}
        {activeRightTab === 'summary' && (
          <Summary
            apiDetail={apiDocDetail?.name}
            method={apiDocDetail?.method}
            methodStyles={methodStyles}
            apiUrl={apiDocDetail?.path}
            description={apiDocDetail?.description}
            params={apiDocDetail?.parameters}
            request={apiDocDetail?.request}
            response={apiDocDetail?.response}
          />
        )}
        {activeRightTab === 'comment' && <Comments />}
        {activeRightTab === 'code' && (
          <CodeSnippet
            path={apiDocDetail?.path}
            method={apiDocDetail?.method}
            parameters={apiDocDetail.parameters}
            request={apiDocDetail.request}
          />
        )}
        {activeRightTab === 'info' && (
          <Info createdData={apiDocDetail?.createdDate} lastModifiedDate={apiDocDetail?.lastModifyDate} />
        )}
      </div>

      <div className='absolute right-0 top-[104px] h-[calc(100vh-104px)] w-[50px] flex flex-col items-center pt-4 bg-white shadow-lg'>
        <FiMessageSquare
          className={`cursor-pointer mb-4 ${activeRightTab === 'comment' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('comment')}
        />
        <FiCode
          className={`cursor-pointer mb-4 ${activeRightTab === 'code' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('code')}
        />
        <FiFileText
          className={`cursor-pointer mb-4 ${activeRightTab === 'summary' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('summary')}
        />
        <FiInfo
          className={`cursor-pointer mb-4 ${activeRightTab === 'info' ? 'text-blue-500' : 'text-gray-500'}`}
          size={24}
          onClick={() => toggleRightTab('info')}
        />
      </div>
    </>
  );
};
export default RightSection;
