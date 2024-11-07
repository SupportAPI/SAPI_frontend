import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import useAuth from './hooks/useAuth';

const App = () => {
  const { loading } = useAuth(); // 로딩 상태 받아오기

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  return (
    <>
      <ToastContainer position='top-center' autoClose={1000} hideProgressBar newestOnTop style={{ zIndex: 99999 }} />
      <AppRoutes />
    </>
  );
};

export default App;
