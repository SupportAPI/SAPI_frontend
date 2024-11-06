import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import { AiOutlineClose } from 'react-icons/ai';
import { EventSourcePolyfill } from 'event-source-polyfill';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import { getToken } from './utils/cookies';
import { useAlarmStore } from './stores/useAlarmStore';

const fadeOut = cssTransition({
  enter: 'animate__animated animate__fadeIn',
  exit: 'animate__animated animate__fadeOut',
});

const App = () => {
  const setUserId = useAuthStore((state) => state.setUserId);
  const none = useState(null);
  const accessToken = getToken();
  const baseUrl = 'https://k11b305.p.ssafy.io';
  const { setReceived } = useAlarmStore();

  useEffect(() => {
    const eventSource = new EventSourcePolyfill(`http://192.168.31.35:8080/api/notifications/connect`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    eventSource.addEventListener('notification', (event) => {
      try {
        // JSON 형식이 아닌 경우 예외 처리
        const data = JSON.parse(event.data);
        setReceived(true);
        toast(
          <div className='flex flex-col'>
            <h4 className='font-bold text-white text-xl'>{data.apiName}</h4>
            <p className='text-white'>{data.message}</p>
          </div>,
          {
            icon: false,
            className: 'p-3 bg-[#4F5A66] text-white rounded-2xl',
            closeButton: <CloseButton />,
          }
        );
        console.log(data);
      } catch (error) {
        console.error('Received non-JSON data:', event.data);
      }
    });
    return () => {
      eventSource.close();
    };
  }, []);

  const CloseButton = ({ closeToast }) => (
    <AiOutlineClose className='text-white cursor-pointer' onClick={closeToast} size={24} />
  );

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        transition={fadeOut}
        toastClassName='flex items-center justify-between p-4 shadow-lg rounded-2xl'
      />
    </>
  );
};

export default App;
