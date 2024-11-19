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
import HistoryDetail from './History/HistoryDetail';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useNavigate } from 'react-router';

const LeftSection = ({
  apiDocDetail,
  categoryList,
  apiId,
  workspaceId,
  occupationState,
  handleOccupationState,
  openHistoryDetail,
  closeHistoryDetail,
  historyApiId,
}) => {
  const [activeLeftTab, setActiveLeftTab] = useState('parameters');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { mutate: confirmWorkspace, isLoading: isSaving } = useConfirmWorkspace();
  const { mutate: handleExport, isLoading: isExportLoading } = useExportDocument();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { subscribe, publish, isConnected } = useWebSocket();
  const navigate = useNavigate();

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

  const handleConfirmDelete = () => {
    publish(`/ws/pub/workspaces/${workspaceId}/docs`, {
      type: 'DELETE',
      message: apiDocDetail.docId,
    });
    setShowDeleteModal(false);
    navigate(`/workspace/${workspaceId}`);
  };

  const handleConfirmSave = () => {
    if (workspaceId && apiDocDetail.docId) {
      confirmWorkspace({ workspaceId, docsId: apiDocDetail.docId });
    }
    setShowSaveModal(false);
  };

  return (
    <>
      {openHistoryDetail ? (
        <HistoryDetail apiId={historyApiId} closeHistoryDetail={closeHistoryDetail} />
      ) : (
        <div className='relative flex-1 p-8 overflow-y-auto h-[calc(100vh-104px)] sidebar-scrollbar scrollbar-gutter-stable'>
          <div className='mb-4'>
            <div className='flex relative justify-between'>
              <label className='flex items-center text-[16px] font-semibold h-8'>Category & Name</label>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={isSaving}
                  className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
                >
                  <FaSave />
                  <span>Save</span>
                </button>
                <button
                  className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
                  onClick={() => setShowDeleteModal(true)}
                >
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
          {showDeleteModal && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
                <h3 className='text-xl font-bold mb-4'>삭제</h3>
                <p className='mb-6'>선택한 API 문서를 삭제하시겠습니까?</p>
                <div className='flex justify-end space-x-4'>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
          {showSaveModal && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
                <h3 className='text-xl font-bold mb-4'>발행</h3>
                <p className='mb-6'>선택한 API 문서를 발행하시겠습니까?</p>
                <div className='flex justify-end space-x-4'>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                  >
                    발행
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LeftSection;
