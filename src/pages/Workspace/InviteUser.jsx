import { useState, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useFetchInviteUser, useInviteMember } from '../../api/queries/useWorkspaceQueries';

const InviteUser = ({ workspaceId, onClose }) => {
  // 유저 초대 상태 관리
  const [inviteUsername, setInviteUserName] = useState('');
  const [isemailvalid, setEmailValid] = useState(true);
  const [isactiveSend, setActiveSend] = useState(false);
  const [emailErrormessage, setEmailErrorMessage] = useState('이메일 양식이 잘못되었습니다.');
  const userId = useAuthStore((state) => state.userId); // 자기 자신 id

  // React Query
  const { data: CheckInviteUser, isLoading, refetch } = useFetchInviteUser(inviteUsername);
  const inviteMemberMutation = useInviteMember();

  // 유저 임시 목록
  const [userList, setUserList] = useState([]);

  // 사용자 이메일을 확인하는 함수
  const CheckUserEmail = async () => {
    // 이미 리스트에 있는 유저인지 확인
    if (userList.some((user) => user.email === inviteUsername)) {
      setEmailErrorMessage('이미 추가된 유저입니다.');
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

  // 사용자 이메일을 확인하는 함수
  const ValidUserEmail = () => {
    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(inviteUsername)) {
      setEmailValid(true);
      CheckUserEmail(inviteUsername);
    } else {
      setEmailValid(false);
      setEmailErrorMessage('이메일 양식이 잘못되었습니다.');
    }
  };

  // 유저 목록에서 유저를 삭제하는 함수
  const removeUser = (email) => {
    if (Array.isArray(userList)) {
      setUserList(userList.filter((user) => user.email !== email));
    }
  };

  const sendInvitation = () => {
    const userIds = userList.map((user) => user.userId);

    const requestData = {
      userIds,
      workspaceId,
    };

    inviteMemberMutation.mutate(requestData);
    onClose();
  };

  useEffect(() => {
    setEmailValid(true);
    setActiveSend(userList.length > 0);
  }, [inviteUsername, userList]);

  return (
    // 모달 화면 위치 정의
    <div className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50'>
      {/* 모달 크기 정의 */}
      <div className='flex flex-col items-center bg-white w-[800px] h-[800px] border rounded-2xl'>
        <header className='flex justify-between items-center w-full text-xl mb-4 h-[80px] bg-blue-100 rounded-t-2xl'>
          <div className='text-3xl ml-6'>Invite User</div>
          <button className='' onClick={onClose}>
            <img className='mr-4 w-6' src='/src/assets/workspace/x.png' alt='' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex justify-center flex-col w-[400px] h-[640px]'>
          <div className='mb-5'>
            {/* 초대할 사람 입력 */}
            <div className='flex flex-col'>
              <div>Invite a member to Project</div>
              <div className='flex justify-between items-center'>
                <input
                  type='text'
                  className='border w-full h-14 p-5 rounded-lg'
                  placeholder='ssafy@ssafy.com'
                  value={inviteUsername}
                  onChange={(e) => setInviteUserName(e.target.value)}
                />
                <button
                  className={`w-20 h-14 ml-3 border rounded-lg bg-green-500 hover:bg-green-600`}
                  onClick={() => ValidUserEmail()}
                >
                  Invite
                </button>
              </div>

              <div className={`${!isemailvalid ? 'visible' : 'invisible'} text-red-500`}>{emailErrormessage}</div>
            </div>
          </div>

          <div className='block h-[40%] border rounded-lg overflow-y-auto h-80 sidebar-scrollbar mb-10'>
            {/* 유저 정보 테이블 칸  */}
            {userList.map((item, index) => (
              <div key={index} className='flex justify-between hover:bg-blue-300 border border-none rounded-lg'>
                <div className='flex items-center p-2'>
                  <img className='border rounded-full w-14 h-14 mr-4' src={item.profileImage} alt='프로필' />
                  <div className=''>
                    <div>{item.nickname}</div>
                    <div>{item.email}</div>
                  </div>
                </div>
                <button>
                  <img
                    className='w-5 mr-5'
                    src='/src/assets/workspace/x.png'
                    alt=''
                    onClick={() => {
                      removeUser(item.email);
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
          <button
            className={`text-white py-2 px-4 rounded-lg ${
              isactiveSend ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
            }`}
            disabled={!isactiveSend}
            onClick={sendInvitation}
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;