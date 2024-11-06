import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import { AiOutlineClose } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const fadeOut = cssTransition({
  enter: 'animate__animated animate__fadeIn',
  exit: 'animate__animated animate__fadeOut',
});

const App = () => {
  const setUserId = useAuthStore((state) => state.setUserId);
  const none = useState(null);

  // useEffect(() => {
  //   const eventSource = new EventSourcePolyfill('${baseUrl}/api/notifications/connect', {
  //     headers: {},
  //   });
  // }, [none]);

  const notify = () => {
    toast(
      <div>
        <h4 className='font-bold text-white text-xl'>유저 정보 조회</h4>
        <p className='text-white'>유저 정보 조회 API가 생성되었습니다.</p>
      </div>,
      {
        icon: false,
        className: 'p-3 bg-[#4F5A66] text-white rounded-2xl',
        closeButton: <CloseButton />,
      }
    );
  };

  const CloseButton = ({ closeToast }) => (
    <AiOutlineClose className='text-white cursor-pointer' onClick={closeToast} size={24} />
  );

  return (
    <>
      <button style={{ display: 'none' }} onClick={notify}>
        Show Toast
      </button>
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
