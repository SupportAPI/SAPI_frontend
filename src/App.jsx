import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { AiOutlineClose } from 'react-icons/ai';
import { getToken } from './utils/cookies';
import { useAlarmStore } from './stores/useAlarmStore';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import useThemeStore from './stores/useThemeStore';

const fadeOut = cssTransition({
  enter: 'animate__animated animate__fadeIn',
  exit: 'animate__animated animate__fadeOut',
});

const App = () => {
  useAuth();

  const accessToken = getToken();
  const baseUrl = 'https://k11b305.p.ssafy.io';
  const { setReceived } = useAlarmStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, [setTheme]);

  useEffect(() => {
    const eventSource = new EventSourcePolyfill(`${baseUrl}/api/notifications/connect`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    eventSource.addEventListener('notification', (event) => {
      try {
        // JSON 형식이 아닌 경우 예외 처리
        const data = JSON.parse(event.data);
        if (data.message !== 'EventStream Created.') {
          toast(
            <div className='flex flex-col '>
              <h4 className='font-bold text-white text-xl dark:text-dark-text'>{data.apiName}</h4>
              <p className='text-white dark:text-dark-text'>{data.message}</p>
            </div>,
            {
              icon: false,
              className: 'p-3 bg-[#4F5A66] text-white rounded-2x dark:text-dark-text',
              closeButton: <CloseButton />,
            }
          );
          setReceived(true);
        }
      } catch (error) {
        console.error('Received non-JSON data:', event.data);
      }
    });
    return () => {
      eventSource.close();
    };
  }, []);

  const CloseButton = ({ closeToast }) => (
    <AiOutlineClose className='text-white cursor-pointer dark:text-dark-text' onClick={closeToast} size={24} />
  );

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        transition={fadeOut}
        toastClassName='flex items-center justify-between p-4 shadow-lg rounded-2xl dark:bg-dark-background dark:text-dark-text border'
      />
    </>
  );
};

export default App;
