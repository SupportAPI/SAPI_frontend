import { useState, useEffect, useRef } from 'react';
import { useUserInfo, useMutateUserInfo } from '../../api/queries/useAPIUserQueries';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { FaPenToSquare } from 'react-icons/fa6';
import useAuthStore from '../../stores/useAuthStore';

const UserComponent = () => {
  const userId = useAuthStore((state) => state.userId);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const nicknameInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo(userId);
  const { mutate } = useMutateUserInfo({
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo', userId]);
    },
    onError: (error) => {
      console.error('Failed to update user info:', error);
    },
  });

  useEffect(() => {
    if (userInfo && userInfo.nickname) {
      setUserNickname(userInfo.nickname);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isEditingNickname && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
    }
  }, [isEditingNickname]);

  // 유저 닉네임 변경
  const handleNicknameChange = (e) => {
    const input = e.target.value;
    const regExp = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g; // 영어, 숫자, 한글만 허용
    const hasSpecialChar = regExp.test(input); // 특수문자 포함 여부 확인
    const hasKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(input); // 한글 포함 여부 확인
    const maxLength = hasKorean ? 10 : 15; // 한글이 포함된 경우 10글자, 아니면 15글자 제한

    if (hasSpecialChar) {
      setNicknameError('특수문자는 사용할 수 없습니다.');
      return;
    }

    // 글자 수가 제한을 초과한 경우
    if (input.length > maxLength) {
      setNicknameError(
        hasKorean ? '한글, 숫자 사용 시 최대 10글자까지 가능합니다.' : '영어, 숫자 사용 시 최대 15글자까지 가능합니다.'
      );
      setUserNickname(input.slice(0, maxLength));
    } else {
      setNicknameError('');
      setUserNickname(input);
    }
  };

  // 닉네임 저장 및 글자 수 제한
  const saveNickname = () => {
    const hasKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(userNickname);
    const hasSpecialChar = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/.test(userNickname);
    const maxLength = hasKorean ? 10 : 15;

    if (userNickname == '') {
      setNicknameError('변경할 닉네임을 입력해주세요.');
      return;
    }

    if (hasSpecialChar) {
      setNicknameError('특수문자는 사용할 수 없습니다.');
      return;
    }

    if (userNickname.length > maxLength) {
      setNicknameError(
        hasKorean ? '한글 사용 시 최대 10글자까지 가능합니다.' : '영어 사용 시 최대 15글자까지 가능합니다.'
      );
      return;
    }

    mutate({ userId, nickname: userNickname });
    setIsEditingNickname(false);
    toast('닉네임이 변경되었습니다.');
  };

  // 프로필 이미지 변경
  const changeImage = async (event) => {
    const file = event.target.files[0];
    if (file && userInfo) {
      mutate({ userId, nickname: userInfo.nickname, profileImage: file });
    }
  };

  if (isUserInfoLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-2xl mb-5'>User</div>
        <div className='border'></div>
        <div className='flex flex-col justify-center items-center mt-10'>
          <div>
            <label htmlFor='profileImageUpload'>
              <img
                src={userInfo.profileImage}
                alt='이미지'
                className='border rounded-3xl w-64 h-64 bg-gray-50 object-cover cursor-pointer'
              />
            </label>
            <input
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              id='profileImageUpload'
              onChange={changeImage}
            />
          </div>

          <div className='flex justify-between w-[80%] mt-12'>
            <div className='w-[200px] mr-10'>
              <div className='text-xl '>E-MAIL</div>
              <div className='ml-2 mt-5 border-b'>{userInfo?.email}</div>
            </div>

            <div className='flex justify-between w-[200px]'>
              <div className='relative w-[200px]'>
                <div className='text-xl '>Nickname</div>
                {isEditingNickname ? (
                  <div className='flex flex-col items-start'>
                    <input
                      type='text'
                      ref={nicknameInputRef}
                      value={userNickname}
                      onChange={handleNicknameChange}
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
                      className='absolute right-0 ml-2 mt-2 bg-blue-500 text-white rounded-xl px-2 py-1'
                    >
                      저장
                    </button>
                    {nicknameError && <div className='text-red-500 mt-1'>{nicknameError}</div>}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
