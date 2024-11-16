import { useState, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import {
  useFetchInviteUser,
  useInviteMember,
  useUserInfo,
  useFetchAutoUserSearch,
} from '../../api/queries/useWorkspaceQueries';
import { IoClose } from 'react-icons/io5';

const InviteUser = ({ workspaceId, onClose }) => {
  // 유저 초대 상태 관리
  const [inviteUsername, setInviteUserName] = useState('');
  const [isemailvalid, setEmailValid] = useState(true);
  const [isactiveSend, setActiveSend] = useState(false);
  const [emailErrormessage, setEmailErrorMessage] = useState('이메일 양식이 잘못되었습니다.');
  const userId = useAuthStore((state) => state.userId); // 자기 자신 id

  // React Query
  const { refetch } = useFetchInviteUser(inviteUsername);
  const inviteMemberMutation = useInviteMember();
  const { data: userInfo } = useUserInfo(userId);

  // 유저 임시 목록
  const [userList, setUserList] = useState([]);

  // 유저 초대 자동완성 상태 관리
  const [showAutoList, setShowAutoList] = useState(false); // 자동완성 목록 표시 상태 추가
  const { data: InviteAutoListRaw } = useFetchAutoUserSearch(workspaceId, inviteUsername, {
    enabled: !!inviteUsername,
  });

  const InviteAutoList = inviteUsername ? InviteAutoListRaw ?? [] : [];

  const handleAutoCompleteClick = (email) => {
    setInviteUserName(email);
    setShowAutoList(false);
  };

  const renderAutoCompleteList = () => {
    return InviteAutoList.filter((user) => !userList.some((addedUser) => addedUser.email === user.email)) // 이미 추가된 유저 제외
      .map((user) => (
        <div
          key={user.userId}
          className='flex items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-hover'
          onClick={() => handleAutoCompleteClick(user.email)}
        >
          <img
            className='border rounded-full w-14 h-14 mr-4 object-contain'
            src={user.profileImage}
            alt='프로필 이미지'
          />
          <div>
            <div>{user.nickname}</div>
            <div className='text-sm text-gray-500'>{user.email}</div>
          </div>
        </div>
      ));
  };

  // 사용자 이메일(양식-정상판단) API 조회
  const CheckUserEmail = async () => {
    // 이미 리스트에 있는 유저인지 확인
    if (userList.some((user) => user.email === inviteUsername)) {
      setEmailErrorMessage('이미 추가된 유저입니다.');
      setEmailValid(false);
      return;
    }

    // 자기자신이면 추가 불가
    if (inviteUsername === userInfo.email) {
      setEmailErrorMessage('자신은 추가할 수 없습니다.');
      setEmailValid(false);
      return;
    }

    const result = await refetch();
    if (result.data) {
      setUserList((prev) => [...prev, result.data]);
      setInviteUserName(''); // 입력 필드 초기화
    } else if (result.status === 'error') {
      setEmailErrorMessage('존재하지 않는 유저 정보 입니다.');
      setEmailValid(false);
    }
  };

  // 사용자 이메일 양식 정상여부확인 먼저
  const ValidUserEmail = () => {
    // 이메일 미 입력 시
    if (inviteUsername === '') {
      setEmailErrorMessage('이메일을 입력해주세요.');
      setEmailValid(false);
      return;
    }

    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(inviteUsername)) {
      setEmailValid(true);
      CheckUserEmail(inviteUsername);
    } else {
      setEmailValid(false);
      setEmailErrorMessage('이메일 양식이 잘못되었습니다.');
    }
  };

  // 유저 초대 함수 (단체초대)
  const sendInvitation = () => {
    const userIds = userList.map((user) => user.userId);

    const requestData = {
      userIds,
      workspaceId,
    };

    inviteMemberMutation.mutate(requestData);
    onClose();
  };

  // 자동 이메일 검증
  useEffect(() => {
    setEmailValid(true);
    setActiveSend(userList.length > 0);
  }, [inviteUsername, userList]);

  // 유저 목록에서 유저를 삭제하는 함수
  const removeUser = (email) => {
    if (Array.isArray(userList)) {
      setUserList(userList.filter((user) => user.email !== email));
    }
  };

  return (
    // 모달 화면 위치 정의
    <div className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50'>
      {/* 모달 크기 정의 */}
      <div className='flex flex-col items-center bg-white w-[800px] h-[800px] border rounded-2xl dark:bg-dark-background'>
        <header className='flex justify-between items-center w-full text-xl mb-4 h-[80px] bg-[#f0f5f8] dark:bg-dark-background border-b rounded-t-2xl'>
          <div className='text-3xl  ml-10'>Invite User</div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex justify-center flex-col w-[400px] h-[640px]'>
          <div className='mb-5'>
            <div className='flex flex-col relative'>
              <div className='text-lg'>Invite a member to Project</div>
              <div className='relative'>
                <input
                  type='text'
                  className='border w-[308px] h-14 p-5 rounded-lg dark:bg-dark-background'
                  placeholder='ssafy@ssafy.com'
                  value={inviteUsername}
                  onChange={(e) => {
                    setInviteUserName(e.target.value);
                    setShowAutoList(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      ValidUserEmail();
                      setShowAutoList(false);
                    }
                  }}
                />
                {showAutoList && inviteUsername && (
                  <div className='absolute top-full left-0 right-0 rounded-lg overflow-y-auto max-h-40 bg-white shadow-lg z-10 sidebar-scrollbar dark:bg-dark-background '>
                    {renderAutoCompleteList()}
                  </div>
                )}
                <button
                  className='w-20 h-14 ml-3 rounded-lg bg-green-500 hover:bg-green-600 text-white'
                  onClick={ValidUserEmail}
                >
                  Invite
                </button>
              </div>

              <div className={`${!isemailvalid ? 'visible' : 'invisible'} text-red-500`}>{emailErrormessage}</div>
            </div>
          </div>

          <div className='block h-[350px] border rounded-lg overflow-y-auto sidebar-scrollbar mb-10'>
            {/* 유저 정보 테이블 칸  */}
            {userList.map((item, index) => (
              <div key={index} className='flex justify-between hover:bg-blue-300 border border-none rounded-lg'>
                <div className='flex items-center p-2'>
                  <img
                    className='border rounded-full w-14 h-14 mr-4 object-contain'
                    src={item.profileImage}
                    alt='프로필'
                  />
                  <div className=''>
                    <div>{item.nickname}</div>
                    <div className='text-sm text-gray-500'>{item.email}</div>
                  </div>
                </div>
                <button
                  className='mr-4'
                  onClick={() => {
                    removeUser(item.email);
                  }}
                >
                  <IoClose className='text-3xl' />
                </button>
              </div>
            ))}
          </div>
          <div className='flex flex-col w-full items-center'>
            <button
              className={`text-white w-full py-2 px-4 mb-2 rounded-lg ${
                isactiveSend ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-300'
              }`}
              disabled={!isactiveSend}
              onClick={sendInvitation}
            >
              Send Invitation
            </button>
            <button
              className='text-sm text-blue-500'
              onClick={() => {
                onClose();
              }}
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
