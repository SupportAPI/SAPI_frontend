import { useState, useRef } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { SlOptions } from 'react-icons/sl';

const SettingMember = () => {
  const [DevelopAuthId, setDevelopAuthId] = useState(null);
  const [useremail, setUseremail] = useState('');
  const [emailvalid, setEmailValid] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // 모달 위치 상태
  const modalRef = useRef();
  const buttonRef = useRef(null);

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

  //이메일 양식 확인 함수
  const validateEmail = (email) => {
    const emailRegax = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    return emailRegax.test(email);
  };

  // 이메일 변경 감지 함수
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUseremail(email);
    setEmailValid(validateEmail(email));
  };

  // 유저 워크스페이스 초대 함수
  const handleInvite = () => {
    if (emailvalid) {
      console.log(`초대 요청: ${useremail}`);
      setUseremail(''); // 입력 필드 초기화
      setEmailValid(false); // 버튼 비활성화
    }
  };

  const users = [
    { id: 1, username: '푸바오가 제일 좋음', email: 'rkdtpgus@naver.com', userimg: '/src/assets/workspace/user1.png' },
    { id: 2, username: '커비1234', email: 'rlaansgml@naver.com', userimg: '/src/assets/workspace/user2.png' },
    { id: 3, username: '커', email: 'qkrcksgh@naver.com', userimg: '/src/assets/workspace/user3.png' },
    {
      id: 4,
      username: '커비먹방',
      email: 'qkrdydqls@naver.com',
      userimg: '/src/assets/workspace/user4.png',
    },
    {
      id: 5,
      username: '고래상어잡으러가자자자',
      email: 'whtjdqls@naver.com',
      userimg: '/src/assets/workspace/user5.png',
    },
    {
      id: 6,
      username: '고래상어잡으러가자',
      email: 'whtjdqls@navsdfasdfasdfasdfsadsadfsadfasd',
      userimg: '/src/assets/workspace/user5.png',
    },
    { id: 7, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 8, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 9, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
  ];

  return (
    <div className='m-10' onClick={handleClickOutside}>
      <div className='flex flex-col'>
        <div className='text-2xl font-semibold mb-5'>Member</div>
        <div className='border'></div>
        <div className='flex flex-col mt-8 m-4'>
          {/* 유저 추가 기능 */}
          <div className='flex items-center mb-2'>
            <MdOutlineMail className='mr-2 text-xl' />
            <div className='text-2xl'> Email Address</div>
          </div>
          <div className='flex justify-between items-center'>
            <input
              type='text'
              placeholder='Invite a member to Project'
              className='border rounded-lg h-16 p-5 mr-5 w-full'
              value={useremail}
              onChange={handleEmailChange}
            />
            {/* Invite 버튼 나중에 추가로 기능 삽입하기 (form 형식 구현할 것) */}
            <button
              onClick={handleInvite}
              disabled={!emailvalid}
              className={`border rounded-lg p-5 w-[150px] ${
                emailvalid
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Invite
            </button>
          </div>
          <div className='border mt-5'></div>
          {/* 아래 멤버 화면 구성 Invite 를 하고 상대방이 수락한다면 아래에 추가해야됨
          만약에 아직 받지 않는 상태라면 메세지 보냈다는 별도의 내용이 필요할듯????? */}
          <div className='mt-5 max-h-[400px] overflow-y-auto sidebar-scrollbar'>
            <table className='min-w-full bg-white'>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className='hover:bg-blue-100 h-[80px]'>
                    <td className='border-b'>
                      <img src={user.userimg} alt={user.username} className='w-10 h-10 rounded-full' />
                    </td>
                    <td className='border-b truncate min-w-[100px] max-w-[100px]'>{user.username}</td>
                    <td className='border-b truncate min-w-[120px] max-w-[120px] pr-3'>{user.email}</td>
                    <td className='border-b pr-3'>
                      <button
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
                          className='border-2 bg-white rounded-lg shadow-lg z-10 w-40'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className='w-full text-left px-4 py-2 hover:bg-blue-100'
                            onClick={() => ChangeDevelopAuth(user.id)}
                          >
                            권한 수정
                          </button>
                          <button
                            className='w-full text-left px-4 py-2 hover:bg-red-100 text-red-500'
                            onClick={() => DeleteUser(user.id)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingMember;
