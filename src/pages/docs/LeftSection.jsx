import { useState } from 'react';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt } from 'react-icons/fa';
import Parameters from './Parameters';
import Response from './Response';
import Request from './Request';
import LeftSectionCategory from './LeftSectionCategory';
import LeftSectionName from './LeftSectionName';
import LeftSectionPath from './LeftSectionPath';
import LeftSectionDescription from './LeftSectionDescription';

const LeftSection = ({ apiDocDetail, categoryList, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');

  const tabComponents = {
    parameters: Parameters,
    request: Request,
    response: Response,
  };

  const ActiveTabComponent = tabComponents[activeLeftTab];

  return (
    <div className='relative flex-1 p-8 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable'>
      <div className='flex items-baseline space-x-2 mb-8 justify-between h-10'>
        <div className='inline-flex items-baseline relative'>
          <LeftSectionCategory
            initialCategory={apiDocDetail.category}
            categoryList={categoryList}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
          &nbsp;&nbsp;&nbsp; <span className='text-2xl'>/</span> &nbsp;&nbsp;&nbsp;
          <LeftSectionName
            initialName={apiDocDetail.name}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
        </div>

        <div className='flex space-x-4'>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaSave />
            <span>Save</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaTrashAlt />
            <span>Delete</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaDownload />
            <span>Export</span>
          </button>
          <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>
      <LeftSectionPath
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
      <LeftSectionDescription
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />

      <div className='border-b mb-4'>
        <nav className='flex space-x-4'>
          {['parameters', 'request', 'response'].map((tab) => (
            <a
              key={tab}
              href='#'
              className={`px-2 py-1 ${activeLeftTab === tab ? 'border-b-2 border-blue-300' : 'text-gray-500'}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </a>
          ))}
        </nav>
      </div>

      <div>
        {ActiveTabComponent && (
          <ActiveTabComponent
            apiDocDetail={apiDocDetail}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
        )}
      </div>
    </div>
  );
};

export default LeftSection;
