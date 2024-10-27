import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const App = () => {
  const setUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.userId;
        setUserId(userId);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [setUserId]);

  return <AppRoutes />;
};

export default App;
