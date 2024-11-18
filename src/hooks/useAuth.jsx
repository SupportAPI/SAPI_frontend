import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken } from '../utils/cookies';
import useAuthStore from '../stores/useAuthStore';
import axios from 'axios';
import { useMutation } from 'react-query';
import { login } from '../api/queries/useAuthQueries';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const setUserId = useAuthStore((state) => state.setUserId);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const accessToken = getToken();

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const isExpired = decodedToken.exp * 1000 < Date.now();
          if (isExpired) {
            const newToken = await refreshAuthToken();
            if (newToken) {
              setToken(newToken);
              const newDecodedToken = jwtDecode(newToken);
              setUserId(newDecodedToken.sub);
            } else {
              logout();
            }
          } else {
            setUserId(decodedToken.sub);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          logout();
        }
      }
      setLoading(false); // 로딩 완료
    };

    initializeAuth();
  }, [setUserId, logout]);

  const refreshAuthToken = async () => {
    try {
      const response = await axios.post('https://k11b305.p.ssafy.io/api/users/reissue');
      return response.data.data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const loginUser = useMutation(({ email, password }) => login(email, password), {
    onSuccess: (response) => {
      const token = response.accessToken;
      setToken(token);

      const decoded = jwtDecode(token);
      const { sub } = decoded;

      setUserId(sub);
      navigate('/workspaces');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    },
  });

  return { loginUser, loading };
};

export default useAuth;
