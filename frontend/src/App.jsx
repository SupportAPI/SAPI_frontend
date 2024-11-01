import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { getToken } from './utils/cookies';

const App = () => {
  const setUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    const accessToken = getToken();
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.sub;
        setUserId(userId);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [setUserId]);

  return <AppRoutes />;
};

export default App;
