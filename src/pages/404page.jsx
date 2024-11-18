import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full relative'>
      {/* 배경 사진이 적용될 가로 전용 컨테이너 */}
      <div
        className='w-screen h-screen bg-cover bg-center flex items-center justify-center object-cover'
        style={{
          backgroundImage: `url('/src/assets/error/404page.JPG')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div
          className='absolute flex flex-col items-start w-[800px] p-10'
          style={{
            top: '45%',
            left: '10%',
            transform: 'translate(-10%, -30%)',
          }}
        >
          <div className='text-6xl mb-5'>404 ERROR</div>

          <div className='text-2xl'>죄송합니다. 페이지를 찾을 수 없습니다.</div>
          <div className='text-2xl'>존재하지 않는 주소를 입력하셨거나</div>
          <div className='text-2xl'>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</div>
          <button
            className='border pt-3 pb-3 pl-10 pr-10 rounded-full bg-blue-200 hover:bg-blue-300 mt-5'
            onClick={() => navigate('/login')}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page404;
