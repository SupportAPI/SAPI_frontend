import { useState, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import {
  useFetchInviteUser,
  useInviteMember,
  useUserInfo,
  useFetchAutoUserSearch,
} from '../../api/queries/useWorkspaceQueries';
import { IoClose } from 'react-icons/io5';
import TextInput from '../../components/common/TextInput';

const InviteUser = ({ workspaceId, onClose }) => {
  const [inviteUsername, setInviteUserName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0); // 현재 선택된 항목의 인덱스
  const [isemailvalid, setEmailValid] = useState(true);
  const [emailErrormessage, setEmailErrorMessage] = useState('');
  const userId = useAuthStore((state) => state.userId);

  // React Query
  const { refetch } = useFetchInviteUser(inviteUsername);
  const inviteMemberMutation = useInviteMember();
  const { data: userInfo } = useUserInfo(userId);

  const [userList, setUserList] = useState([]);
  const [showAutoList, setShowAutoList] = useState(false);
  const { data: InviteAutoListRaw } = useFetchAutoUserSearch(workspaceId, inviteUsername, {
    enabled: !!inviteUsername,
  });

  // 필터링된 자동완성 목록
  const InviteAutoList = inviteUsername
    ? (InviteAutoListRaw ?? []).filter((user) => !userList.some((addedUser) => addedUser.email === user.email))
    : [];

  // 검색어가 변경되거나 InviteAutoList가 변경될 때 선택된 인덱스를 조정
  useEffect(() => {
    if (InviteAutoList.length > 0) {
      setSelectedIndex((prevIndex) => (prevIndex >= InviteAutoList.length ? InviteAutoList.length - 1 : prevIndex));
    } else {
      setSelectedIndex(0);
    }
  }, [InviteAutoList]);

  const handleAutoCompleteClick = (user) => {
    addUserToList(user.email, user);
    setShowAutoList(false);
  };

  const addUserToList = async (email, user) => {
    if (userList.some((existingUser) => existingUser.email === email)) {
      setEmailErrorMessage('이미 추가된 유저입니다.');
      setEmailValid(false);
      return;
    }

    if (email === userInfo.email) {
      setEmailErrorMessage('자신은 추가할 수 없습니다.');
      setEmailValid(false);
      return;
    }

    if (!user) {
      const result = await refetch();
      if (result.data) {
        setUserList((prev) => [...prev, result.data]);
        setInviteUserName('');
      } else {
        setEmailErrorMessage('존재하지 않는 유저 정보입니다.');
        setEmailValid(false);
      }
    } else {
      setUserList((prev) => [...prev, user]);
      setInviteUserName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex < InviteAutoList.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === 'Enter' && InviteAutoList[selectedIndex]) {
      handleAutoCompleteClick(InviteAutoList[selectedIndex]);
      setShowAutoList(false);
    }
  };

  const renderAutoCompleteList = () => {
    return InviteAutoList.map((user, index) => (
      <div
        key={user.userId}
        className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-hover ${
          selectedIndex === index ? 'bg-gray-300 dark:bg-dark-hover' : ''
        }`}
        ref={(el) => {
          if (selectedIndex === index && el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        }}
        onClick={() => handleAutoCompleteClick(user)}
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

  const sendInvitation = () => {
    const userIds = userList.map((user) => user.userId);

    const requestData = {
      userIds,
      workspaceId,
    };

    inviteMemberMutation.mutate(requestData);
    onClose();
  };

  const removeUser = (email) => {
    if (Array.isArray(userList)) {
      setUserList(userList.filter((user) => user.email !== email));
    }
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50 overflow-auto'>
      <div
        className='flex flex-col bg-white w-full max-w-2xl h-auto max-h-[90vh] border rounded-2xl dark:bg-dark-background'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari */
            }
          `}
        </style>

        <header className='flex justify-between items-center w-full text-gray-700 px-6 py-3 z-10 sticky'>
          <div className='text-xl dark:text-dark-text'>Invite User</div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl dark:text-dark-text' />
          </button>
        </header>

        <div className='flex flex-col w-full p-6 pt-1 space-y-1 overflow-y-auto'>
          <div className='relative'>
            <TextInput
              id='inviteUsername'
              label='Invite a member to Project'
              placeholder='ssafy@ssafy.com'
              value={inviteUsername}
              clearable='true'
              onChange={(e) => {
                setInviteUserName(e.target.value);
                setShowAutoList(true);
                setEmailValid(true);
              }}
              onKeyDown={handleKeyDown}
              error={!isemailvalid ? emailErrormessage : ''}
              autoComplete='off'
            />
            {showAutoList && inviteUsername && (
              <div className='absolute top-full left-0 right-0 rounded-lg overflow-y-auto max-h-40 bg-white shadow-lg z-10 sidebar-scrollbar dark:bg-dark-background'>
                {renderAutoCompleteList()}
              </div>
            )}
          </div>

          <div className='block h-[350px] border rounded-lg overflow-y-auto sidebar-scrollbar mb-10'>
            {userList.map((item, index) => (
              <div
                key={index}
                className='flex justify-between hover:bg-blue-300 dark:hover:bg-dark-hover border-none rounded-lg'
              >
                <div className='flex items-center p-2'>
                  <img
                    className='border rounded-full w-14 h-14 mr-4 object-contain'
                    src={item.profileImage}
                    alt='프로필'
                  />
                  <div>
                    <div>{item.nickname}</div>
                    <div className='text-sm text-gray-500'>{item.email}</div>
                  </div>
                </div>
                <button className='mr-4' onClick={() => removeUser(item.email)}>
                  <IoClose className='text-3xl' />
                </button>
              </div>
            ))}
          </div>

          <div className='flex flex-col w-full items-center pt-4'>
            <button
              className='bg-blue-500 text-white w-full py-2 px-4 mb-2 rounded-lg hover:bg-blue-400'
              onClick={sendInvitation}
              disabled={userList.length === 0}
            >
              Send Invitation
            </button>
            <button className='text-sm text-blue-500' onClick={onClose}>
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
