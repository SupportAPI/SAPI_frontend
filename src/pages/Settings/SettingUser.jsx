import { FaPenToSquare } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa';
import useAuthStore from '../../stores/useAuthStore';
import { useUserInfo, useMutateUserInfo } from '../../api/queries/useAPIUserQueries';
import { useQueryClient } from 'react-query';
import { useState, useEffect } from 'react';

const UserComponent = () => {
  const userId = useAuthStore((state) => state.userId); // 자기 자신 id
  const [userNickname, setUserNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const queryClient = useQueryClient();

  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo(userId);
  const { mutate, isLoading, isError, error } = useMutateUserInfo({
    onSuccess: (data) => {
      console.log('User info updated successfully:', data);
      queryClient.invalidateQueries(['userInfo', userId]);
    },
    onError: (error) => {
      console.error('Failed to update user info:', error);
    },
  });

  // userInfo가 로드되었을 때 userNickname을 업데이트
  useEffect(() => {
    if (userInfo && userInfo.nickname) {
      setUserNickname(userInfo.nickname);
    }
  }, [userInfo]);

  // 프로필 이미지 변경
  const changeImage = async (event) => {
    const file = event.target.files[0];
    if (file && userInfo) {
      // userInfo가 정의된 상태에서만 mutate 호출
      mutate({ userId, nickname: userInfo.nickname, profileImage: file });
    }
  };

  // 닉네임 변경 저장
  const saveNickname = () => {
    if (userNickname) {
      mutate({ userId, nickname: userNickname });
      setIsEditingNickname(false);
    }
  };

  if (isUserInfoLoading) {
    return <div>Loading...</div>;
  } // 로딩 중 표시

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-2xl font-semibold mb-5'>User</div>
        <div className='border'></div>
        <div className='flex flex-col justify-center items-center mt-10'>
          {/* 프로필 이미지 및 편집 버튼 */}
          <div className='relative'>
            <img
              src={userInfo.profileImage} // 기본 이미지 추가
              alt='이미지'
              className='border rounded-3xl w-64 h-64 bg-gray-50 object-cover'
            />
            <input
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              id='profileImageUpload'
              onChange={changeImage}
            />
            <label
              htmlFor='profileImageUpload'
              className='absolute border-2 rounded-full bg-white hover:bg-blue-200 bottom-2 right-2 text-xl'
            >
              <FaCamera className='m-3' />
            </label>
          </div>
          {/* 이메일 유저이름 추가 */}
          <div className='flex justify-between w-[80%] mt-12'>
            <div className='w-[200px] mr-10'>
              <div className='text-2xl font-semibold'>E-MAIL</div>
              <div className='ml-2 mt-5 border-b'>{userInfo?.email}</div>
            </div>
            <div className='w-[200px]'>
              <div className='text-2xl font-semibold'>UserName</div>
              <div className='ml-2 mt-5 border-b'>{userInfo?.nickname}</div>
            </div>
          </div>
          {/* 닉네임 편집 영역 */}
          <div className='flex justify-between w-[80%] mt-12'>
            <div className='relative w-[200px]'>
              <div className='text-2xl font-semibold'>Nickname</div>
              {/* 닉네임 편집 버튼 */}
              {isEditingNickname ? (
                <div className='flex items-center'>
                  <input
                    type='text'
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    className={`ml-2 mt-5 border-b w-full outline-none ${
                      isEditingNickname ? 'border-blue-500 text-blue-500 font-bold' : 'border-gray-300'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveNickname();
                      }
                    }}
                  />
                  <button
                    onClick={saveNickname}
                    className='absolute ml-2 bg-blue-500 text-white right-0 rounded-xl px-2 py-1'
                  >
                    저장
                  </button>
                </div>
              ) : (
                <div className='flex items-center'>
                  <div className='ml-2 mt-5 border-b w-full'>{userInfo.nickname}</div>
                  <button
                    className='absolute border-none rounded-full top-[45px] right-0 text-xl hover:bg-blue-200'
                    onClick={() => setIsEditingNickname(true)}
                  >
                    <FaPenToSquare className='m-1' />
                  </button>
                </div>
              )}
            </div>
            <div className='w-[200px]'>
              <div className='text-2xl font-semibold'></div>
              <div className='ml-2 mt-5'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
