import { useState } from 'react';
import { useMutation } from 'react-query';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/queries/useAuthQueries';
import useAuthStore from '../stores/useAuthStore';
import { setToken } from '../utils/cookies';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setUserId = useAuthStore((state) => state.setUserId);
  const navigate = useNavigate();

  const loginMutation = useMutation((loginData) => login(loginData.username, loginData.password), {
    onSuccess: (response) => {
      const token = response.data.token;
      setToken(token);

      const decoded = jwtDecode(token);
      const { userId } = decoded;
      setUserId(userId);

      navigate('/workspaces');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Login</h2>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <div>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors'
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loginMutation.isError && (
          <p className='mt-4 text-red-500 text-center'>
            {loginMutation.error.message || 'Login failed. Please try again.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
