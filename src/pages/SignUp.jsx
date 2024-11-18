import { useState, useEffect } from 'react';
import TextInput from '../components/common/TextInput';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleEmailCheck = () => {
    const isDuplicate = false;
    if (!isDuplicate) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setShowEmailCodeInput(true);
      setTimer(180);
      alert(`인증 코드: ${code}`);
    } else {
      setErrorMessage('틀린 이메일입니다.');
    }
  };

  const handleEmailVerify = () => {
    if (emailCode === generatedCode) {
      setIsEmailVerified(true);
      setShowEmailCodeInput(false);
      alert('이메일 인증 성공!');
    } else {
      alert('인증 코드가 올바르지 않습니다.');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isEmailVerified) {
      alert('이메일 인증이 완료되지 않았습니다.');
      return;
    }
    alert('회원가입 성공!');
  };

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
              disabled={isEmailVerified}
              clearable={!isEmailVerified}
              containerClassName='space-y-1'
              fixedLabel={true}
              error={errorMessage}
            />
            {!isEmailVerified && (
              <button
                type='button'
                className='w-[20%] bg-[#f7fafb] text-gray-800  rounded-md hover:bg-[#dfe4e6]'
                onClick={handleEmailCheck}
              >
                전송
              </button>
            )}
          </div>

          {showEmailCodeInput && !isEmailVerified && (
            <div className='flex w-[100%] justify-between'>
              <div>
                <div className='relative'>
                  <TextInput
                    label='인증 코드'
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    id='email-code'
                    clearable
                    containerClassName='space-y-1'
                    fixedLabel={true}
                  />
                  <div className='absolute top-2 right-2'>{timer > 0 ? `${formatTime(timer)}` : '시간 만료'}</div>
                </div>
              </div>
              <button
                type='button'
                className='bg-[#f7fafb] text-gray-800 rounded-md hover:bg-[#dfe4e6] w-[20%]'
                onClick={handleEmailVerify}
              >
                확인
              </button>
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
            />
          </div>

          <div className='mb-12'>
            <TextInput
              label='비밀번호 확인'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id='confirm-password'
              containerClassName='space-y-1'
              fixedLabel={true}
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
