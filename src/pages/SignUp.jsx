import { useState, useEffect } from 'react';

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
      alert('이미 사용 중인 이메일입니다.');
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
        <form onSubmit={handleSignup} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>이메일</label>
            <div className='flex space-x-2'>
              <input
                type='email'
                className='flex-1 border rounded-md px-3 py-2 focus:ring-[#f7fafb] focus:border-[#f7fafb]'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isEmailVerified}
              />
              {!isEmailVerified && (
                <button
                  type='button'
                  className='px-4 py-2 bg-[#f7fafb] text-gray-800 rounded-md hover:bg-[#dfe4e6]'
                  onClick={handleEmailCheck}
                >
                  확인
                </button>
              )}
            </div>
          </div>

          {showEmailCodeInput && !isEmailVerified && (
            <div>
              <label className='block text-sm font-medium text-gray-700'>인증 코드</label>
              <div className='relative'>
                <input
                  type='text'
                  className='w-full border rounded-md px-3 py-2 pr-20 focus:ring-[#f7fafb] focus:border-[#f7fafb]'
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  required
                />
                <span className='absolute inset-y-0 right-20 flex items-center text-sm text-red-500 font-medium pointer-events-none'>
                  {timer > 0 ? formatTime(timer) : '시간 만료'}
                </span>
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 px-4 bg-[#f7fafb] text-gray-800 rounded-r-md hover:bg-[#dfe4e6]'
                  onClick={handleEmailVerify}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>비밀번호</label>
            <input
              type='password'
              className='w-full border rounded-md px-3 py-2 focus:ring-[#f7fafb] focus:border-[#f7fafb]'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>비밀번호 확인</label>
            <input
              type='password'
              className='w-full border rounded-md px-3 py-2 focus:ring-[#f7fafb] focus:border-[#f7fafb]'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>닉네임</label>
            <input
              type='text'
              className='w-full border rounded-md px-3 py-2 focus:ring-[#f7fafb] focus:border-[#f7fafb]'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
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
