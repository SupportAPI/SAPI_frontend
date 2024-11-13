import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser.mutate({ email, password });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-500'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md dark:bg-dark-background dark:text-dark-text'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Login</h2>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded-lg dark:bg-dark-background'
            />
          </div>
          <div>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded-lg dark:bg-dark-background'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white dark:text-dark-text py-2 rounded hover:bg-blue-600 transition-colors'
            disabled={loginUser.isLoading}
          >
            {loginUser.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loginUser.isError && (
          <p className='mt-4 text-red-500 text-center'>
            {loginUser.error.message || 'Login failed. Please try again.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
