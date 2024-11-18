import { useState } from 'react';
import { FiCode, FiFileText, FiMessageSquare, FiInfo, FiX } from 'react-icons/fi';
import CodeSnippet from './RightSectionCodeSnippet';
import Info from './RightSectionInfo';
import RightSectionComments from './RightSectionComments';
import RightSectionSummary from './RightSectionSummary';
import RightSectionCodeSnippet from './RightSectionCodeSnippet';
import RightSectionInfo from './RightSectionInfo';

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
        className={`transition-width duration-300 p-8 mr-[50px] z-0 relative ${
          activeRightTab === 'comment' ? '' : 'overflow-y-auto'
        } dark:bg-dark-background dark:text-dark-text ${
          activeRightTab ? 'w-[500px] min-w-[500px] max-w-[500px]' : 'w-[350px] min-w-[350px] max-w-[350px]'
        } ${activeRightTab ? 'border-l' : ''} sidebar-scrollbar pb-5`}
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
          <RightSectionSummary apiDocDetail={apiDocDetail} methodStyles={methodStyles} />
        )}
        {activeRightTab === 'comment' && <RightSectionComments docsId={apiDocDetail.docId} workspaceId={workspaceId} />}
        {activeRightTab === 'code' && (
          <RightSectionCodeSnippet
            path={apiDocDetail?.path}
            method={apiDocDetail?.method}
            parameters={apiDocDetail.parameters}
            request={apiDocDetail.request}
          />
        )}
        {activeRightTab === 'info' && (
          <RightSectionInfo createdData={apiDocDetail?.createdDate} lastModifiedDate={apiDocDetail?.lastModifyDate} />
        )}
      </div>

      <div className='absolute border-l right-0 top-[104px] h-[calc(100vh-104px)] w-[50px] flex flex-col items-center pt-4 bg-white shadow-lg dark:bg-dark-background dark:text-dark-text'>
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
