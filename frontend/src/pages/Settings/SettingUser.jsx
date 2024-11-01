import { FaPenToSquare } from 'react-icons/fa6';
import { useState } from 'react';

const UserComponent = () => {
  const [username, setUsername] = useState('강세현');
  const [useremail, setUseremail] = useState('test1@naver.com');
  const [userimage, setUserimage] = useState('/src/assets/workspace/user1.png');
  const [userNickname, setUsernickname] = useState('팬더가좋아');

  // 프로필 이미지 변경
  const changeImage = () => {
    setUserimage('/src/assets/workspace/user2.png');
    return;
  };

  // 유저 닉네임 변경
  const changeNickname = () => {
    setUsernickname('커비가좋아');
    console.log(userNickname);
    return;
  };

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-6xl mb-5'>User</div>
        <div className='border'></div>
        <div className='flex flex-col justify-center items-center mt-10'>
          {/* 여기에 relative 추가 */}
          <div className='relative'>
            <img src={userimage} alt='이미지' className='border rounded-full w-64 h-64 bg-gray-100' />
            {/* 아이콘 위치를 img의 우측 하단에 배치 */}
            <button
              className='absolute border rounded-full bg-blue-50 hover:bg-blue-200 bottom-3 right-3 text-3xl'
              onClick={() => {
                changeImage();
              }}
            >
              <FaPenToSquare className='m-3' />
            </button>
          </div>
          {/* 이메일 유저이름 추가 */}
          <div className='flex justify-between w-[80%] mt-10'>
            <div className='w-[200px]'>
              <div className='text-2xl'>E-MAIL</div>
              <div className='text-xl ml-5 mt-5 border-b'>{useremail}</div>
            </div>
            <div className='w-[200px]'>
              <div className='text-2xl'>UserName</div>
              <div className='text-xl ml-5 mt-5 border-b'>{username}</div>
            </div>
          </div>
          {/* Nickname과 아이콘을 감싸는 div에 relative 추가 */}
          <div className='flex justify-between w-[80%] mt-10'>
            <div className='relative w-[200px]'>
              <div className='text-2xl'>Nickname</div>
              <div className='text-xl ml-5 mt-5 border-b'>{userNickname}</div>
              {/* Nickname 옆에 아이콘을 배치 */}
              <button
                className='absolute rounded-full hover:bg-blue-200 top-[50px] right-0 text-xl'
                onClick={() => {
                  changeNickname();
                }}
              >
                <FaPenToSquare className='m-1' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
