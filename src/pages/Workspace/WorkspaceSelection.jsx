// src/pages/WorkspaceSelection.js .
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchWorkspaces, useDeleteWorkspace, useModifiedWorkspace } from '../../api/queries/useWorkspaceQueries';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import CreateWorkspace from './CreateWorkspace';
import InviteUser from './InviteUser';
import Settings from './Settings';
import Header from './Header';
import CheckModal from '../../components/common/CheckModal';
import { useTabStore } from '../../stores/useTabStore';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { SlOptions } from 'react-icons/sl';

const WorkspaceSelection = () => {
  const navigate = useNavigate();
  const { removeAllTabs } = useTabStore();
  const { data: workspaces, isLoading } = useFetchWorkspaces();
  const [prograssTable, setPrograssTable] = useState([]);
  const [doneTable, setDoneTable] = useState([]);
  const [newworkspaceid, setNewWorkSpaceId] = useState('');
  const queryClient = useQueryClient();
  const [filterWorkspaces, setFilterWorkspaces] = useState('');
  const [filterDoneWorkspaces, setFilterDoneWorkspaces] = useState('');

  const modalRef = useRef();
  const buttonRef = useRef(null);
  const [DevelopAuthId, setDevelopAuthId] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // 모달 위치 상태

  const { mutate } = useModifiedWorkspace();

  const handleModifiedWorkspace = (workspaceId, mainImage, projectName, domain, description, isCompleted) => {
    mutate({
      workspaceId,
      mainImage,
      projectName,
      domain,
      description,
      isCompleted,
    });
  };

  // 워크스페이스 삭제
  const workSpaceDeleteMutation = useDeleteWorkspace({
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
      toast.success('워크스페이스가 삭제되었습니다.'); // 성공 메시지
    },
    onError: (error) => {
      console.error('워크스페이스 삭제 실패:', error); // 에러 로그 출력
      if (error.response?.status === 403) {
        toast.error('삭제 권한이 없습니다.');
      } else {
        toast.error('워크스페이스 삭제 중 문제가 발생했습니다.');
      }
    },
  });

  useEffect(() => {
    if (!isLoading && workspaces) {
      // 초기 테이블 설정
      setPrograssTable(workspaces.filter((workspace) => !workspace.isCompleted));
      setDoneTable(workspaces.filter((workspace) => workspace.isCompleted));
    }
  }, [isLoading, workspaces]);

  useEffect(() => {
    if (!workspaces) return;

    // Progress Table 필터링: 검색어와 isCompleted 조건 동시 적용
    const filteredPrograssTable = workspaces.filter(
      (workspace) =>
        !workspace.isCompleted && // isCompleted가 false
        workspace.projectName.toLowerCase().includes(filterWorkspaces.toLowerCase()) // 검색어 필터
    );
    setPrograssTable(filteredPrograssTable);
  }, [filterWorkspaces, workspaces]);

  useEffect(() => {
    if (!workspaces) return;

    // Done Table 필터링: 검색어와 isCompleted 조건 동시 적용
    const filteredDoneTable = workspaces.filter(
      (workspace) =>
        workspace.isCompleted && // isCompleted가 true
        workspace.projectName.toLowerCase().includes(filterDoneWorkspaces.toLowerCase()) // 검색어 필터
    );
    setDoneTable(filteredDoneTable);
  }, [filterDoneWorkspaces, workspaces]);

  // 탭 다 제거
  useEffect(() => {
    removeAllTabs();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
        setIsModalOpen(false);
        setIsOpenCreateWorkspace(false);
        setIsOpenInviteUser(false);
        setIsOpenSetting(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpenCreateWorkspace || isOpenInviteUser || isOpenSetting || isModalOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 차단
    } else {
      document.body.style.overflow = ''; // 원래 상태로 복구
    }

    // 컴포넌트 언마운트 시 스타일 초기화
    return () => {
      document.body.style.overflow = '';
    };
  });

  const handleWorkspaceSelect = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  // 워크스페이스 삭제
  const DeleteWorkspace = (workspaceId) => {
    if (workspaceId) {
      workSpaceDeleteMutation.mutate(workspaceId);
      setDevelopAuthId(null);
    }
  };

  // Delete 버튼 토글 함수
  const toggleDevelopAuth = (index, e) => {
    if (DevelopAuthId === index) {
      setDevelopAuthId(null);
    } else {
      setDevelopAuthId(index);
      buttonRef.current = e.target; // 클릭한 버튼 요소를 참조로 저장
      updateModalPosition(); // 위치 초기 설정
    }
  };

  // 스크롤 및 리사이즈에 따라 모달 위치 업데이트 함수
  const updateModalPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top + window.scrollY + 15,
        left: rect.left + window.scrollX + 15,
      });
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
    queryClient.invalidateQueries('workspaces');
  };
  const handleSettingsClick = (value) => {
    queryClient.invalidateQueries('workspaces');
    if (value === '1') {
      setIsOpenSetting(true);
    } else {
      setIsOpenSetting(false);
    }
  };

  // table 목록 view 상태 관리
  const [isP_TableVisible, setP_IsTableVisible] = useState(true);
  const [isD_TableVisible, setD_IsTableVisible] = useState(true);

  // // table Sort 관리
  // const [isSortPOrder, setIsSortPOrder] = useState({ column: '', direction: 'asc' });
  // const [isSortDOrder, setIsSortDOrder] = useState({ column: '', direction: 'asc' });

  // // Prograss 정렬 함수
  // const sortPTable = (column) => {
  //   setPrograssTable(workspaces);
  //   const direction = isSortPOrder.direction === 'asc' ? 'desc' : 'asc';
  //   const sortedData = [...prograssTable].sort((a, b) => {
  //     if (direction === 'asc') {
  //       return a[column] > b[column] ? 1 : -1;
  //     } else {
  //       return a[column] < b[column] ? 1 : -1;
  //     }
  //   });
  //   setPrograssTable(sortedData);
  //   setIsSortPOrder({ column, direction });
  // };

  // // Done 정렬 함수
  // const sortDTable = (column) => {
  //   setDoneTable(workspaces);
  //   const direction = isSortDOrder.direction === 'asc' ? 'desc' : 'asc';
  //   const sortedData = [...doneTable].sort((a, b) => {
  //     if (direction === 'asc') {
  //       return a[column] > b[column] ? 1 : -1;
  //     } else {
  //       return a[column] < b[column] ? 1 : -1;
  //     }
  //   });
  //   setDoneTable(sortedData);
  //   setIsSortDOrder({ column, direction });
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteWorkspaceId, setdeleteWorkspaceId] = useState('');
  const handleAgree = () => {
    DeleteWorkspace(deleteWorkspaceId);
    setIsModalOpen(false); // 모달 닫기
  };

  const handleCancel = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  // 로딩 중인 경우 로딩 메시지 표시
  if (isLoading) {
    return <p>Loading workspaces...</p>;
  }

  return (
    <div className='outer-wrapper bg-[#f0f5f8]/50 dark:bg-dark-background dark:text-dark-text h-full w-full min-h-screen min-w-screen'>
      <Header
        onSettingsClick={(value) => {
          if (value === '1') {
            handleSettingsClick('1');
          } else {
            handleSettingsClick('2');
          }
        }}
      />
      <div className='inner-content overflow-y-auto overflow-x-auto h-full w-full'>
        {/* 헤더 위치 */}

        <div className='flex flex-col w-[1200px] mx-auto'>
          <div className='p-5'>
            <div className='flex flex-col mx-auto'>
              {/* 제목과 워크스페이스가 들어갈 공간 */}
              <section className='flex justify-between items-center mb-2'>
                <p className='text-2xl font-bold'>Workspaces</p>
                {/* 누르면 워크스페이스 추가 모달 띄우기 */}
                <button
                  className='p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-500 '
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
              {isOpenSetting && <Settings onClose={() => handleSettingsClick(2)} />}
              {isModalOpen && (
                <CheckModal
                  modalTitle='워크스페이스 삭제 확인'
                  modalContent={`정말로 삭제하시겠습니까?
                삭제된 워크스페이스는 복구할 수 없습니다.`}
                  cancleFunction={handleCancel}
                  cancleName='취소'
                  agreeFunction={handleAgree}
                  agreeName='확인'
                />
              )}

              {/* In Progress가 들어갈 공간 */}
              <section className='flex flex-col border rounded-3xl bg-white dark:bg-dark-background p-8'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold'>In Progress</p>
                  <button
                    className='flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-dark-background dark:hover:bg-dark-hover'
                    onClick={() => setP_IsTableVisible(!isP_TableVisible)}
                  >
                    {isP_TableVisible ? <FaMinus /> : <FaPlus />}
                  </button>
                </div>
                {/* 가로 바 */}
                <div className='border mt-2 mb-2 w-full'></div>
                <div className={`custom-table-move ${isP_TableVisible ? 'show' : ''}`}>
                  {/* 여기에 진행중인 워크 스페이스 항목 넣기 */}
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
                                value={filterWorkspaces}
                                onChange={(e) => setFilterWorkspaces(e.target.value)}
                              />
                            </div>
                          </th>
                          <th className='p-2 w-[30%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center'>
                                <p className={`mr-2 px-4 py-2 rounded-3xl`}>Description</p>
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[25%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center'>
                                <p className={`mr-2 px-4 py-2 rounded-3xl `}>Active User</p>
                              </button>
                            </div>
                          </th>

                          <th className='p-2 w-[25%]'>
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
                              className='border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-hover'
                              onClick={() => handleWorkspaceSelect(item.id)}
                              onMouseLeave={() => setDevelopAuthId(null)}
                            >
                              <td className='p-2 w-[23%] truncate'>
                                <div className='flex items-center ml-3'>
                                  <img
                                    src={item.mainImage}
                                    alt='icon'
                                    className='border min-w-[60px] max-w-[60px] min-h-[50px] max-h-[50px] rounded-lg object-contain'
                                  />
                                  <div className='flex flex-col ml-3'>
                                    <div className='text-left max-w-[150px]'>{item.projectName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className='p-2 w-[30%] text-center'>
                                <div
                                  className='rounded-lg h-[50px] p-1'
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-all',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2, // 원하는 줄 수
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {item.description}
                                </div>
                              </td>
                              <td className='p-2 w-[25%] text-center'>{item.id}</td>
                              <td className='p-2 w-[25%] text-center'>
                                <div className='inline-block option-button opacity-0 transition-opacity duration-200'>
                                  <button
                                    className='inline-block p-4'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDevelopAuth(index, e);
                                    }}
                                  >
                                    <SlOptions />
                                  </button>
                                  {DevelopAuthId === index && (
                                    <div
                                      ref={modalRef}
                                      style={{
                                        position: 'absolute',
                                        top: modalPosition.top,
                                        left: modalPosition.left,
                                      }}
                                      className='border bg-white rounded-lg shadow-lg z-10 w-28 p-2 dark:bg-dark-background'
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        className='w-full text-center text-gray-700 py-2 hover:bg-gray-100 rounded-t-lg dark:hover:bg-dark-hover dark:text-dark-text'
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
                                        프로젝트 완료
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
                        ) : filterWorkspaces === '' ? (
                          <tr>
                            <td colSpan='4' className='text-center py-[80px]'>
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
                        ) : (
                          <tr>
                            <td colSpan='4' className='text-center py-[100px]'>
                              <div>No Workspace matched your search</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Done이 들어갈 공간 */}
              <section className='flex flex-col border w-full rounded-3xl bg-white p-8 mt-5 dark:bg-dark-background'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold'>Done</p>
                  <button
                    className='flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-dark-background dark:hover:bg-dark-hover'
                    onClick={() => setD_IsTableVisible(!isD_TableVisible)}
                    onMouseLeave={() => setDevelopAuthId(null)} // Hover 종료 시 Delete 옵션 버튼 닫기
                  >
                    {isD_TableVisible ? <FaMinus /> : <FaPlus />}
                  </button>
                </div>
                {/* 가로 바 */}
                <div className='border mt-2 mb-2 w-full'></div>
                <div className={`custom-table-move ${isD_TableVisible ? 'show' : ''}`}>
                  {/* 여기에 끝난 워크 스페이스 항목 넣기 */}
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
                          <th className='p-2 w-[30%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center'>
                                <p className={`mr-2 px-4 py-2 rounded-3xl`}>Description</p>
                              </button>
                            </div>
                          </th>

                          <th className='p-2 w-[25%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center'>
                                <p className={`mr-2  px-4 py-2 rounded-3xl`}>RENEWAL DATE</p>
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[25%]'>
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
                              <td className='p-2 w-[30%] text-center'>
                                <div
                                  className='rounded-lg h-[50px] p-1'
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-all',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2, // 원하는 줄 수
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {item.description}
                                </div>
                              </td>
                              <td className='p-2 w-[25%] text-center'>{item.id}</td>
                              <td className='p-2 w-[25%] text-center'>
                                {/* 행이 hover 될 때 보이는 버튼 */}
                                <div className='inline-block option-button opacity-0 transition-opacity duration-200'>
                                  <button
                                    className='inline-block p-4'
                                    onClick={(e) => {
                                      e.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 방지
                                      toggleDevelopAuth(index, e);
                                    }}
                                  >
                                    <SlOptions />
                                  </button>
                                  {DevelopAuthId === index && (
                                    <div
                                      ref={modalRef}
                                      style={{
                                        position: 'absolute',
                                        top: modalPosition.top,
                                        left: modalPosition.left,
                                      }}
                                      className='border bg-white rounded-lg shadow-lg z-10 w-28 p-2 dark:bg-dark-background'
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        className='w-full text-center text-gray-700 py-2 hover:bg-gray-100 dark:text-dark-text dark:hover:bg-dark-hover rounded-t-lg'
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
                              <div>No WorkSpace yet</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelection;
