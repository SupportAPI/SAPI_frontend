import { useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { SlOptions } from 'react-icons/sl';

const SettingMember = () => {
  const users = [
    { id: 1, username: '푸바오가 제일 좋음', email: 'rkdtpgus@naver.com', userimg: '/src/assets/workspace/user1.png' },
    { id: 2, username: '커비1234', email: 'rlaansgml@naver.com', userimg: '/src/assets/workspace/user2.png' },
    { id: 3, username: '커비꽃', email: 'qkrcksgh@naver.com', userimg: '/src/assets/workspace/user3.png' },
    { id: 4, username: '커비먹방', email: 'qkrdydqls@naver.com', userimg: '/src/assets/workspace/user4.png' },
    { id: 5, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 6, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 7, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 8, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 9, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { id: 10, username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
  ];

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-6xl mb-5'>Member</div>
        <div className='border'></div>
        <div className='flex flex-col mt-8 m-10'>
          {/* 이메일 추가 기능 */}
          <div className='flex items-center mb-2'>
            <MdOutlineMail className='mr-2 text-3xl' />
            <div className='text-3xl'> Email Address</div>
          </div>
          <div className='flex justify-between items-center'>
            <input
              type='text'
              placeholder='Invite a member to Project'
              className='border rounded-lg h-16 text-xl p-5 mr-5 w-full'
            />
            {/* Invite 버튼 나중에 추가로 기능 삽입하기 (form 형식 구현할 것) */}
            <button className='border rounded-lg p-5 bg-green-500 hover:bg-green-600 text-white w-[150px]'>
              Invite
            </button>
          </div>
          <div className='border mt-5'></div>
          {/* 아래 멤버 화면 구성 Invite 를 하고 상대방이 수락한다면 아래에 추가해야됨
          만약에 아직 받지 않는 상태라면 메세지 보냈다는 별도의 내용이 필요할듯????? */}
          <div className='mt-5 h-[500px] overflow-y-auto sidebar-scrollbar'>
            <table className='min-w-full bg-white'>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-blue-100'>
                    <td className='py-2 border-b'>
                      <img src={user.userimg} alt={user.username} className='w-10 h-10 rounded-full' />
                    </td>
                    <td className='py-2 border-b'>{user.username}</td>
                    <td className='py-2 border-b'>{user.email}</td>
                    <td className='py-2 border-b'>
                      <button>
                        <SlOptions />
                      </button>
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
