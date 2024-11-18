import { FaMinus, FaPlus } from 'react-icons/fa6';
import { SlOptions } from 'react-icons/sl';

const DoneSection = ({
  doneTable,
  isD_TableVisible,
  filterDoneWorkspaces,
  setFilterDoneWorkspaces,
  toggleTableVisibility,
  handleWorkspaceSelect,
  handleModifiedWorkspace,
  setDevelopAuthId,
  DevelopAuthId,
  updateModalPosition,
  setIsModalOpen,
  setdeleteWorkspaceId,
  modalPosition,
}) => {
  return (
    <section className='flex flex-col border rounded-3xl bg-white dark:bg-dark-background p-8 mt-5'>
      <div className='flex justify-between items-center mb-2'>
        <p className='text-xl font-bold'>Done</p>
        <button
          className='flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-dark-background dark:hover:bg-dark-hover'
          onClick={toggleTableVisibility}
        >
          {isD_TableVisible ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <div className='border mt-2 mb-2 w-full'></div>
      <div className={`custom-table-move ${isD_TableVisible ? 'show' : ''}`}>
        <div className='h-80'>
          <table className='w-full table-fixed custom-table'>
            <thead>
              <tr className='text-left border-b'>
                <th className='p-2 w-[23%]'>
                  <div className='flex items-center'>
                    <div>🍳</div>
                    <input
                      className='ml-2 border-b font-normal dark:bg-dark-background'
                      type='text'
                      placeholder='Search'
                      value={filterDoneWorkspaces}
                      onChange={(e) => setFilterDoneWorkspaces(e.target.value)}
                    />
                  </div>
                </th>
                <th className='p-2 w-[30%]'>Description</th>
                <th className='p-2 w-[25%]'>Renewal Date</th>
                <th className='p-2 w-[25%]'>Option</th>
              </tr>
            </thead>
            <tbody className='block overflow-y-auto h-[260px] sidebar-scrollbar'>
              {doneTable.length > 0 ? (
                doneTable.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-hover'
                    onClick={() => handleWorkspaceSelect(item.id)}
                    onMouseLeave={() => setDevelopAuthId(null)}
                  >
                    <td className='p-2 w-[23%]'>
                      <div className='flex items-center ml-3'>
                        <img
                          src={item.mainImage}
                          alt='icon'
                          className='border min-w-[60px] max-w-[60px] min-h-[50px] max-h-[50px] rounded-lg object-contain'
                        />
                        <div className='flex flex-col ml-3'>
                          <div className='text-left'>{item.projectName}</div>
                        </div>
                      </div>
                    </td>
                    <td className='p-2 w-[30%] text-center'>{item.description}</td>
                    <td className='p-2 w-[25%] text-center'>{item.id}</td>
                    <td className='p-2 w-[25%] text-center'>
                      <div className='inline-block option-button opacity-0 transition-opacity duration-200'>
                        <button
                          className='inline-block p-4'
                          onClick={(e) => {
                            e.stopPropagation();
                            setDevelopAuthId(index);
                            updateModalPosition(e);
                          }}
                        >
                          <SlOptions />
                        </button>
                        {DevelopAuthId === index && (
                          <div
                            style={{
                              position: 'absolute',
                              top: modalPosition.top,
                              left: modalPosition.left,
                            }}
                            className='border bg-white rounded-lg shadow-lg z-10 w-28 p-2 dark:bg-dark-background'
                          >
                            <button
                              className='w-full text-center text-gray-700 py-2 hover:bg-gray-100 rounded-t-lg'
                              onClick={() => {
                                handleModifiedWorkspace(
                                  item.id,
                                  '',
                                  item.projectName,
                                  item.domain,
                                  item.description,
                                  !item.isCompleted
                                );
                                setDevelopAuthId(null);
                              }}
                            >
                              완료 취소
                            </button>
                            <button
                              className='w-full text-center text-red-500 py-2 hover:bg-red-100 rounded-b-lg'
                              onClick={() => {
                                setIsModalOpen(true);
                                setdeleteWorkspaceId(item.id);
                                setDevelopAuthId(null);
                              }}
                            >
                              DELETE
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center py-[100px]'>
                    <div>No Workspace yet</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DoneSection;
