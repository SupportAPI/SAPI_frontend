import { useState, useRef, useEffect } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { SlOptions } from 'react-icons/sl';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import {
  useFetchInviteUser,
  useInviteMember,
  fetchUserInWorkspace,
  useUserInfo,
} from '../../api/queries/useWorkspaceQueries';
import { toast } from 'react-toastify';

const SettingMember = () => {
  const userId = useAuthStore((state) => state.userId);
  const [DevelopAuthId, setDevelopAuthId] = useState(null);
  const [useremail, setUseremail] = useState('');
  const [isemailvalid, setEmailValid] = useState(true);
  const [emailErrormessage, setEmailErrorMessage] = useState('이메일 양식이 잘못되었습니다.');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef();
  const buttonRef = useRef(null);
  const { workspaceId: currentWorkspaceId } = useParams();
  const { data: userInfo } = useUserInfo(userId);
  const [userList, setUserList] = useState([]);
  const { refetch } = useFetchInviteUser(useremail);
  const inviteMemberMutation = useInviteMember();

  const userListInWorkspace = useCallback(async () => {
    if (currentWorkspaceId) {
      const userList = await fetchUserInWorkspace(currentWorkspaceId);
      setUserList(userList.filter((user) => user.email != userInfo.email));
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    userListInWorkspace();
  }, [userListInWorkspace]);

  // Delete 버튼 토글 함수
  const toggleDevelopAuth = (index, e) => {
    if (DevelopAuthId === index) {
      setDevelopAuthId(null);
    } else {
      setDevelopAuthId(index);
      buttonRef.current = e.target;
      updateModalPosition();
    }
  };

  // 스크롤 및 리사이즈에 따라 모달 위치 업데이트 함수
  const updateModalPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top + window.scrollY + 30,
        left: rect.left + window.scrollX + 5,
      });
    }
  };

  // 유저 권한 수정 요청
  const ChangeDevelopAuth = (userId) => {
    console.log(userId);
    console.log('권한 수정을 요청했습니다.');
  };

  // 유저 삭제 요청
  const DeleteUser = (userId) => {
    console.log(`${userId}를 삭제 요청하셨습니다.`);
  };

  // 메뉴 외부 클릭 시 닫기
  const handleClickOutside = () => {
    setDevelopAuthId(null);
  };

  // 사용자 이메일(양식-정상판단) API 조회
  const CheckUserEmail = async () => {
    // 자기자신이면 추가 불가
    if (useremail === userInfo.email) {
      setEmailErrorMessage('자신은 추가할 수 없습니다.');
      setEmailValid(false);
      return;
    }

    // 이미 리스트에 있는 유저인지 확인
    if (userList.some((user) => user.email === useremail)) {
      setEmailErrorMessage('이미 추가된 유저입니다.');
      setEmailValid(false);
      return;
    }

    const result = await refetch();
    if (result.data) {
      sendInvitation(result.data.userId);
      setUseremail(''); // 입력 필드 초기화
    } else if (result.status === 'error') {
      setEmailErrorMessage('존재하지 않는 유저 정보 입니다.');
      setEmailValid(false);
    }
  };

  // 사용자 이메일 양식 정상여부확인 먼저
  const ValidUserEmail = () => {
    if (useremail === '') {
      setEmailErrorMessage('이메일을 입력해주세요.');
      setEmailValid(false);
      return;
    }

    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(useremail)) {
      setEmailValid(true);
      CheckUserEmail(useremail);
    } else {
      setEmailValid(false);
      setEmailErrorMessage('이메일 양식이 잘못되었습니다.');
    }
  };

  // 유저 초대 함수 (개인 초대)
  const sendInvitation = (userId) => {
    const requestData = {
      userIds: [userId],
      workspaceId: currentWorkspaceId,
    };

    inviteMemberMutation.mutate(requestData);

    setUseremail('');
    setEmailValid(false);
    toast('Workspace 초대가 완료되었습니다.');
  };

  useEffect(() => {
    setEmailValid(true);
  }, [useremail, userList]);

  return (
    <div className='m-10' onClick={handleClickOutside}>
      <div className='flex flex-col'>
        <div className='text-2xl mb-5'>Member</div>
        <div className='border'></div>
        <div className='flex flex-col mt-8 m-4'>
          {/* 유저 추가 기능 */}
          <div className='flex items-center mb-2'>
            <MdOutlineMail className='mr-2 text-xl' />
            <div className='text-xl'> Email Address</div>
          </div>
          <div className='flex justify-between items-center'>
            <input
              type='text'
              placeholder='Invite a member to Project'
              className='border rounded-lg h-16 p-5 mr-5 w-full'
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  ValidUserEmail();
                }
              }}
            />
            <button
              onClick={() => ValidUserEmail()}
              className={`w-20 h-14 ml-3 rounded-lg bg-green-500 hover:bg-green-600`}
            >
              Invite
            </button>
          </div>
          <div className={`${!isemailvalid ? 'visible' : 'invisible'} text-red-500`}>{emailErrormessage}</div>
          <div className='border mt-5'></div>
          <div className='mt-5 max-h-[400px] overflow-y-auto sidebar-scrollbar'>
            <table className='min-w-full bg-white custom-table'>
              <tbody>
                {userList.length > 0 ? (
                  userList.map((user, index) => (
                    <tr key={user.userId} className='hover:bg-blue-100 h-[80px]'>
                      <td className='border-b'>
                        <img
                          src={user.profileImage}
                          alt={user.nickname}
                          className='border w-12 h-12 rounded-full object-contain'
                        />
                      </td>
                      <td className='border-b truncate min-w-[100px] max-w-[100px]'>{user.nickname}</td>
                      <td className='border-b truncate min-w-[120px] max-w-[120px] pr-3'>{user.email}</td>
                      <td className='border-b pr-3' onMouseLeave={() => setDevelopAuthId(null)}>
                        <div className='option-button opacity-0 transition-opacity duration-200'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDevelopAuth(index, e);
                            }}
                          >
                            <SlOptions />
                          </button>
                        </div>
                        {DevelopAuthId === index && (
                          <div
                            ref={modalRef}
                            style={{
                              position: 'absolute',
                              top: modalPosition.top,
                              left: modalPosition.left,
                            }}
                            className='border-2 bg-white rounded-lg shadow-lg z-10 w-40'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-blue-100'
                              onClick={() => ChangeDevelopAuth(user.userId)}
                            >
                              권한 수정
                            </button>
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-red-100 text-red-500'
                              onClick={() => DeleteUser(user.userId)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4' className='text-center py-4 text-gray-500'>
                      현재 초대된 유저가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingMember;
