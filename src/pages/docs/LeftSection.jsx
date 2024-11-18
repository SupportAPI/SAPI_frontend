import { useState, useEffect, useRef } from 'react';
import { FaDownload, FaSave, FaShareAlt, FaTrashAlt } from 'react-icons/fa';
import Parameters from './Parameters';
import Response from './Response';
import Request from './Request';
import LeftSectionCategory from './LeftSectionCategory';
import LeftSectionName from './LeftSectionName';
import LeftSectionPath from './LeftSectionPath';
import LeftSectionDescription from './LeftSectionDescription';
import { useConfirmWorkspace, useExportDocument } from '../../api/queries/useApiDocsQueries';

const LeftSection = ({ apiDocDetail, categoryList, apiId, workspaceId, occupationState, handleOccupationState }) => {
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { mutate: confirmWorkspace, isLoading: isSaving } = useConfirmWorkspace();
  const { mutate: handleExport, isLoading: isExportLoading } = useExportDocument();

  const tabComponents = {
    parameters: Parameters,
    request: Request,
    response: Response,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (workspaceId && apiDocDetail.docId) {
      confirmWorkspace({ workspaceId, docsId: apiDocDetail.docId });
    }
  };

  const handleExportClick = (ext) => {
    setIsDropdownOpen(false);
    handleExport({ workspaceId, docsId: apiDocDetail.docId, ext });
  };

  const ActiveTabComponent = tabComponents[activeLeftTab];

  return (
    <div className='relative flex-1 p-8 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable'>
      <div className='mb-4'>
        <div className='flex relative justify-between'>
          <label className='flex items-center text-[16px] font-semibold h-8'>Category & Name</label>
          <div className='flex space-x-1'>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
            >
              <FaSave />
              <span>Save</span>
            </button>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaTrashAlt />
              <span>Delete</span>
            </button>
            <div className='relative inline-block text-left' ref={dropdownRef}>
              <button
                className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <FaDownload />
                <span>Export</span>
              </button>
              {isDropdownOpen && (
                <div className='absolute left-0 mt-2 w-25 bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                  <div className='py-1'>
                    {['MARKDOWN', 'HTML'].map((ext) => (
                      <button
                        key={ext}
                        onClick={() => handleExportClick(ext)}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left'
                      >
                        {ext}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'>
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
        </div>
        <div className='flex relative'>
          <LeftSectionCategory
            initialCategory={apiDocDetail.category}
            categoryList={categoryList}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
          &nbsp;&nbsp;&nbsp; <span className='text-2xl'> </span> &nbsp;&nbsp;&nbsp;
          <LeftSectionName
            initialName={apiDocDetail.name}
            apiId={apiId}
            workspaceId={workspaceId}
            occupationState={occupationState}
            handleOccupationState={handleOccupationState}
          />
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
