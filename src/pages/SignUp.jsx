import { useState, useEffect } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import TextInput from '../components/common/TextInput';
import {
  useUserEmailDuplication,
  useUserAuthentication,
  useUserEmailConfirm,
  useUserSignup,
} from '../api/queries/useAPIUserQueries';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const SignupForm = () => {
  const [email, setEmail] = useState(''); // 이메일 상태 관리
  const [emailValid, setEmailValid] = useState(false); // 이메일 양식 확인
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);
  const [code, setEmailCode] = useState('');
  const [isAuthorized, setCheckCode] = useState(false);
  const [isCodeExpired, setCodeExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [timer, setTimer] = useState(0);

  const { mutate: duplicationMutate } = useUserEmailDuplication();
  const { mutate: authenticationMutate } = useUserAuthentication();
  const { mutate: userEmailConfirmMutate } = useUserEmailConfirm();
  const { mutate: userSignupMutate } = useUserSignup();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCodeExpired(true); // 타이머 종료 시 만료 처리
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // 에러 메세지 상태 관리
  const [errorEmail, setErrorEmail] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [errorpassword, setErrorpassword] = useState('');
  const [errorNickname, setErrorNickname] = useState('');

  useEffect(() => {
    setErrorEmail('');
    setEmailValid(false);
    setShowEmailCodeInput(false);
  }, [email]);

  // 사용자 이메일 양식 정상여부확인 먼저
  const ValidUserEmail = () => {
    if (email === '') {
      setErrorEmail('이메일을 입력해주세요.');
      setEmailValid(false);
      return;
    }

    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(email)) {
      emailDuplicate(email);
    } else {
      setEmailValid(false);
      setErrorEmail('이메일 양식이 잘못되었습니다.');
    }
  };

  // 인증 코드 요청 함수
  const emailDuplicate = (email) => {
    // 이메일 중복 확인
    duplicationMutate(email, {
      onSuccess: (data) => {
        if (!data) {
          setEmailValid(true);
          toast('인증 코드가 전송되었습니다.');
          setShowEmailCodeInput(true);
          setTimer(180);
          // 이메일 인증코드 요청
          handleCodeCheck();
        } else {
          setErrorEmail('이메일이 중복입니다.');
        }
      },
      onError: () => {
        setErrorEmail('오류가 발생으로 다시 시도해주세요.');
      },
    });
  };

  // 이메일 인증 코드 발송 요청
  const handleCodeCheck = () => {
    // 이메일 코드 발송 요청
    authenticationMutate(email, {
      onSuccess: (data) => {
        if (data) {
          //
        } else {
          setErrorEmail('메일을 다시 확인해주세요.');
          setShowEmailCodeInput(false);
        }
      },
      onError: () => {
        setErrorEmail('메일을 다시 확인해주세요.');
        setShowEmailCodeInput(false);
      },
    });
  };

  // 이메일 코드 확인 요청
  const handleCodeVerify = () => {
    userEmailConfirmMutate(
      { email, code },
      {
        onSuccess: (data) => {
          if (data) {
            setCheckCode(true);
            setErrorCode('');
            setErrorEmail('');
            setTimer(0); // 타이머 멈춤
            setCodeExpired(false); // 시간 초과 메시지 숨기기
          } else {
            setCheckCode(false);
            setErrorCode('인증번호가 일치하지 않습니다.');
          }
        },
        onError: () => {
          setCheckCode(false);
          setErrorCode('인증번호가 일치하지 않습니다.');
        },
      }
    );
  };

  // 회원 가입 요청
  const handleSignup = (e) => {
    e.preventDefault();
    let cnt = 0;

    if (email == '') {
      setErrorEmail('이메일을 입력해주세요');
      cnt++;
    }

    if (password == '') {
      setErrorpassword('비밀번호를 입력해주세요.');
      cnt++;
    }

    // 이메일 회원가입 코드 작성
    if (password != passwordConfirm) {
      setErrorpassword('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (nickname == '') {
      setErrorNickname('닉네임을 입력해주세요.');
      return;
    }

    if (!isAuthorized) {
      setErrorEmail('이메일을 인증해주세요.');
      return;
    }

    if (cnt > 0) {
      return;
    }

    userSignupMutate(
      { email, password, passwordConfirm, nickname, isAuthorized, code },
      {
        onSuccess: (data) => {
          if (data == 200) {
            toast('회원가입이 완료되었습니다.');
            navigate('/login');
          } else if (data == 400) {
            toast('이메일 인증 코드가 불일치합니다.');
          }
        },
        onError: () => {
          toast('오류가 발생으로 다시 시도해주세요.');
        },
      }
    );
  };

  useEffect(() => {
    setErrorpassword('');
  }, [password, passwordConfirm]);

  useEffect(() => {
    setErrorNickname('');
  }, [nickname]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8fcfc] via-[#f7fafb] to-[#fbfcfd]'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-96'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>회원가입</h2>
        <form onSubmit={handleSignup} className='space-y-8'>
          <div className='w-[100%] flex justify-between'>
            <TextInput
              label='이메일'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id='email'
              clearable={!emailValid}
              containerClassName='space-y-1'
              fixedLabel={true}
              error={errorEmail}
              disabled={emailValid}
            />
            {!emailValid ? (
              <button
                type='button'
                className='w-[20%] bg-[#f7fafb] text-gray-800  rounded-md hover:bg-[#dfe4e6]'
                onClick={ValidUserEmail}
                disabled={emailValid}
              >
                전송
              </button>
            ) : (
              <button className='flex justify-center items-center w-[20%] text-green-500'>
                <FaRegCheckCircle />
              </button>
            )}
          </div>

          {showEmailCodeInput && emailValid && (
            <div className='flex w-[100%] justify-between'>
              <div>
                <div className='relative'>
                  <TextInput
                    label='인증 코드'
                    value={code}
                    onChange={(e) => setEmailCode(e.target.value)}
                    id='email-code'
                    containerClassName='space-y-1'
                    fixedLabel={true}
                    error={errorCode}
                    disabled={isAuthorized}
                  />
                  <div className={`absolute top-2 right-2 ${!isCodeExpired ? 'text-red-500' : ''}`}>
                    {isAuthorized
                      ? '' // 인증 성공 시 메시지 없음
                      : !isCodeExpired
                      ? '시간이 초과되었습니다.'
                      : `${formatTime(timer)}`}
                  </div>
                </div>
              </div>
              {!isAuthorized ? (
                <button
                  type='button'
                  className='bg-[#f7fafb] text-gray-800 rounded-md hover:bg-[#dfe4e6] w-[20%]'
                  onClick={handleCodeVerify}
                >
                  확인
                </button>
              ) : (
                <button className='flex justify-center items-center w-[20%] text-green-500'>
                  <FaRegCheckCircle />
                </button>
              )}
            </div>
          )}

          <div className='mb-12'>
            <TextInput
              label='비밀번호'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              containerClassName='space-y-1'
              fixedLabel={true}
              error={errorpassword}
            />
          </div>

          <div className='mb-12'>
            <TextInput
              label='비밀번호 확인'
              type='password'
              value={passwordConfirm}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id='confirm-password'
              containerClassName='space-y-1'
              fixedLabel={true}
              error={errorpassword}
            />
          </div>

          <div>
            <TextInput
              label='닉네임'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              id='nickname'
              containerClassName='space-y-1 mb-4'
              fixedLabel={true}
              error={errorNickname}
            />
          </div>

          <button type='submit' className='w-full bg-[#f7fafb] text-gray-800 py-2 rounded-md hover:bg-[#dfe4e6]'>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
