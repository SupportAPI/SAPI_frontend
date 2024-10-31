// src/pages/WorkspaceSelection.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchWorkspaces } from '../../api/queries/useWorkspaceQueries';
import CreateWorkspace from './CreateWorkspace';
import InviteUser from './InviteUser';
import Settings from './Settings';
import Header from './Header';

const WorkspaceSelection = () => {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useFetchWorkspaces();
  const [showP_DeleteButton, setShowP_DeleteButton] = useState(null);
  const [showD_DeleteButton, setShowD_DeleteButton] = useState(null);
  const [prograssTable, setPrograssTable] = useState([]);
  const [doneTable, setDoneTable] = useState([]);
  const [newworkspaceid, setNewWorkSpaceId] = useState('');

  const handleWorkspaceSelect = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  // 일단 대기
  const handleDeleteWorkspace = (workspaceId) => {
    console.log(workspaceId);
    console.log('삭제요청되었습니다.');
  };

  // Delete 버튼 토글 함수
  const toggleDeleteButton = (value, index) => {
    if (value == 'p') {
      setShowP_DeleteButton(showP_DeleteButton === index ? null : index);
    } else {
      setShowD_DeleteButton(showD_DeleteButton === index ? null : index);
    }
  };

  // CreateWorkspace 모달 관리
  const [step, setStep] = useState(1); // 1: 워크스페이스 생성, 2: 초대 화면
  const [isOpenCreateWorkspace, setIsOpenCreateWorkspace] = useState(false);
  const [isOpenInviteUser, setIsOpenInviteUser] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const handleCloseModal = () => {
    setIsOpenCreateWorkspace(false);
    setIsOpenInviteUser(false);
    setStep(1);
  };
  const handleCompleteWorkspace = (workspaceid) => {
    setNewWorkSpaceId(workspaceid);
    setIsOpenCreateWorkspace(false);
    setIsOpenInviteUser(true);
    setStep(2);
  };
  const handleSettingsClick = () => {
    setIsOpenSetting(true);
  };

  // table 목록 view 상태 관리
  const [isP_TableVisible, setP_IsTableVisible] = useState(true);
  const [isD_TableVisible, setD_IsTableVisible] = useState(true);

  // table Sort 관리
  const [isSortPOrder, setIsSortPOrder] = useState({ column: '', direction: 'asc' });
  const [isSortDOrder, setIsSortDOrder] = useState({ column: '', direction: 'asc' });

  // Prograss 정렬 함수
  const sortPTable = (column) => {
    setPrograssTable(workspaces);
    const direction = isSortPOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...prograssTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setPrograssTable(sortedData);
    setIsSortPOrder({ column, direction });
  };

  // Done 정렬 함수
  const sortDTable = (column) => {
    setDoneTable(workspaces);
    const direction = isSortDOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...doneTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setDoneTable(sortedData);
    setIsSortDOrder({ column, direction });
  };

  // 데이터가 로딩된 후 테이블 데이터를 설정하는 로직 추가
  useEffect(() => {
    if (!isLoading && workspaces) {
      // Progress Table 설정
      setPrograssTable(workspaces);

      // Done Table 설정

      setDoneTable([]);
    }
  }, [isLoading, workspaces]);

  // 로딩 중인 경우 로딩 메시지 표시
  if (isLoading) {
    return <p>Loading workspaces...</p>;
  }

  return (
    <div className='flex flex-col items-align bg-[#F0F5F8] overflow-hidden h-screen'>
      {/* 헤더 위치 */}
      <Header onSettingsClick={handleSettingsClick} />
      <div className='flex flex-col w-[1200px] mx-auto'>
        <div className='p-8'>
          <div className='flex flex-col mx-auto'>
            {/* 제목과 워크스페이스가 들어갈 공간 */}
            <section className='flex justify-between items-center mb-2'>
              <p className='text-3xl'>Workspaces</p>
              {/* 누르면 워크스페이스 추가 모달 띄우기 */}
              <button
                className='border p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500'
                onClick={() => {
                  setIsOpenCreateWorkspace(true);
                }}
              >
                + Add WorkSpaces
              </button>
            </section>

            {step === 1 && isOpenCreateWorkspace && (
              <CreateWorkspace
                onComplete={(workspaceId) => handleCompleteWorkspace(workspaceId)}
                onClose={() => handleCloseModal()}
              ></CreateWorkspace>
            )}
            {step === 2 && isOpenInviteUser && (
              <InviteUser workspaceId={newworkspaceid} onClose={() => handleCloseModal()}></InviteUser>
            )}
            {/* Setting 모달 */}
            {isOpenSetting && <Settings onClose={() => setIsOpenSetting(false)} />}

            {/* In Progress가 들어갈 공간 */}
            <section className='relative flex flex-col border rounded-3xl bg-white p-8'>
              <div className='flex justify-between items-center mb-2'>
                <p className=' text-2xl'>In Progress</p>
                <button
                  className='absolute flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200'
                  onClick={() => setP_IsTableVisible(!isP_TableVisible)}
                >
                  {isP_TableVisible ? (
                    <img className='w-4' src='/src/assets/workspace/Minus.png' alt='' />
                  ) : (
                    <img className='w-4' src='/src/assets/workspace/plus.png' alt='' />
                  )}
                </button>
              </div>
              {/* 가로 바 */}
              <div className='border mt-2 mb-2 w-full'></div>
              <div className={`custom-table-move ${isP_TableVisible ? 'show' : ''}`}>
                {/* 여기에 진행중인 워크 스페이스 항목 넣기 */}
                <div className='h-80'>
                  <table className='w-full custom-table'>
                    <thead>
                      <tr className='text-left border-b'>
                        <th className='p-2 w-[35%]'>
                          <div className='flex items-center'>
                            <div>🍳</div>
                            <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <button
                              className='flex justify-center items-center'
                              onClick={() => sortPTable('ActiveUser')}
                            >
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>Active User</p>
                              {isSortPOrder.column === 'ActiveUser' && isSortPOrder.direction === 'asc' ? '▲' : '▼'}
                            </button>
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <button className='flex justify-center items-center' onClick={() => sortPTable('TeamID')}>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>Team ID</p>
                              {isSortPOrder.column === 'TeamID' && isSortPOrder.direction === 'asc' ? '▲' : '▼'}
                            </button>
                          </div>
                        </th>

                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <p className='pr-2 py-2'>Option</p>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className='block overflow-y-auto h-[260px] sidebar-scrollbar'>
                      {prograssTable.length > 0 ? (
                        prograssTable.map((item, index) => (
                          <tr
                            key={index}
                            className='border-b cursor-pointer hover:bg-gray-50' // hover 시 배경색
                            onClick={() => handleWorkspaceSelect(item.id)} // 행 전체 클릭 이벤트
                          >
                            <td className='p-2 w-[35%] h-[65px]'>
                              <div className='flex items-center ml-3'>
                                <img
                                  src={item.mainImage}
                                  alt='icon'
                                  className='border w-16 h-12 rounded-lg object-contain'
                                />
                                <div className='flex flex-col ml-3'>
                                  <div className='text-left text-xl'>{item.projectName}</div>
                                  <div className='text-sm text-gray-500 truncate w-[300px]'>{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className='p-2 w-[20%] text-center'>{item.ActiveUser}1</td>
                            <td className='p-2 w-[20%] text-center'>{item.TeamID}2</td>
                            <td className='p-2 w-[20%] text-center relative'>
                              {/* 행이 hover 될 때 보이는 버튼 */}
                              <div className='inline-block option-button opacity-0 transition-opacity duration-200'>
                                <button
                                  className='inline-block'
                                  onClick={(e) => {
                                    e.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 방지
                                    toggleDeleteButton('p', index);
                                  }}
                                >
                                  <img className='h-6 mx-auto' src='/src/assets/workspace/3point.png' alt='' />
                                </button>
                                {/* Delete 옵션 */}
                                {showP_DeleteButton === index && (
                                  <button
                                    className='absolute border bg-white hover:bg-blue-200 rounded-lg pt-5 pb-5 pr-6 pl-6'
                                    onClick={(e) => {
                                      e.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 방지
                                      handleDeleteWorkspace(item.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='4' className='text-center py-[100px]'>
                            <div>No Workspace yet</div>
                            <button
                              className='border p-2 rounded-lg bg-white hover:bg-blue-50 mt-4'
                              onClick={() => {
                                setIsOpenCreateWorkspace(true);
                              }}
                            >
                              + New Workspace
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Done이 들어갈 공간 */}
            <section className='relative flex flex-col border w-full rounded-3xl bg-white p-8 mt-5'>
              <div className='flex justify-between items-center mb-2'>
                <p className=' text-2xl'>Done</p>
                <button
                  className='absolute flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200'
                  onClick={() => setD_IsTableVisible(!isD_TableVisible)}
                >
                  {isD_TableVisible ? (
                    <img className='w-4' src='/src/assets/workspace/Minus.png' alt='' />
                  ) : (
                    <img className='w-4' src='/src/assets/workspace/plus.png' alt='' />
                  )}
                </button>
              </div>
              {/* 가로 바 */}
              <div className='border mt-2 mb-2 w-full'></div>
              <div className={`custom-table-move ${isD_TableVisible ? 'show' : ''}`}>
                <div>
                  {/* 여기에 끝난 워크 스페이스 항목 넣기 */}
                  <div className='h-80'>
                    <table className='w-full custom-table'>
                      <thead>
                        <tr className='text-left border-b'>
                          <th className='p-2 w-[35%]'>
                            <div className='flex items-center'>
                              <div>🍳</div>
                              <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center' onClick={() => sortDTable('User')}>
                                <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>User</p>
                                {isSortDOrder.column === 'User' && isSortDOrder.direction === 'asc' ? '▲' : '▼'}
                              </button>
                            </div>
                          </th>

                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <button
                                className='flex justify-center items-center'
                                onClick={() => sortDTable('RenewalDate')}
                              >
                                <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>RENEWAL DATE</p>
                                {isSortDOrder.column === 'RenewalDate' && isSortDOrder.direction === 'asc' ? '▲' : '▼'}
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <p className='pr-2 py-2'>Option</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className='block overflow-y-auto h-[260px] sidebar-scrollbar'>
                        {doneTable.length > 0 ? (
                          doneTable.map((item, index) => (
                            <tr
                              key={index}
                              className='border-b cursor-pointer hover:bg-gray-50' // hover 시 배경색
                              onClick={() => handleWorkspaceSelect(item.id)} // 행 전체 클릭 이벤트
                            >
                              <td className='p-2 w-[35%] h-[65px]'>
                                <div className='flex items-center ml-3'>
                                  <img
                                    src={item.mainImage}
                                    alt='icon'
                                    className='border w-12 h-10 rounded-lg object-contain'
                                  />
                                  <div className='flex flex-col ml-3'>
                                    <div className='text-left text-xl'>{item.projectName}</div>
                                    <div className='text-sm text-gray-500 truncate w-[300px]'>{item.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className='p-2 w-[20%] text-center'>{item.User}</td>
                              <td className='p-2 w-[20%] text-center'>{item.RenewalDate}</td>
                              <td className='p-2 w-[20%] text-center relative'>
                                {/* 행이 hover될 때 보이는 버튼 */}
                                <div className='inline-block option-button opacity-0 transition-opacity duration-200'>
                                  <button
                                    className='inline-block'
                                    onClick={(e) => {
                                      e.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 방지
                                      toggleDeleteButton('d', index);
                                    }}
                                  >
                                    <img className='h-6 mx-auto' src='/src/assets/workspace/3point.png' alt='' />
                                  </button>
                                  {/* Delete 옵션 */}
                                  {showD_DeleteButton === index && (
                                    <button
                                      className='absolute border bg-white hover:bg-blue-200 rounded-lg pt-5 pb-5 pr-6 pl-6'
                                      onClick={(e) => {
                                        e.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 방지
                                        handleDeleteWorkspace(item.id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='4' className='text-center py-[125px]'>
                              <div>No WorkSpace yet</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelection;
