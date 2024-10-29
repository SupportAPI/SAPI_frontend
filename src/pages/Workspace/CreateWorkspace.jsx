import { useState } from 'react';

const CreateWorkspace = ({ onClose, children }) => {
  // 워크스페이스 이름 상태 관리
  const [isworkspacename, setWorkSpaceName] = useState(true);

  //워크 스페이스 초대 인원 관리
  const [addUser, setAddUser] = useState('');

  // 임시 유저 보드
  const users = [
    { username: '푸바오가 제일 좋음', email: 'rkdtpgus@naver.com', userimg: '/src/assets/workspace/user1.png' },
    { username: '커비1234', email: 'rlaansgml@naver.com', userimg: '/src/assets/workspace/user2.png' },
    { username: '커비꽃', email: 'qkrcksgh@naver.com', userimg: '/src/assets/workspace/user3.png' },
    { username: '커비먹방', email: 'qkrdydqls@naver.com', userimg: '/src/assets/workspace/user4.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
    { username: '고래상어잡으러가자', email: 'whtjdqls@naver.com', userimg: '/src/assets/workspace/user5.png' },
  ];
  // children 은 필요하면 사용 필요 없으면 됐음

  return (
    // 모달 화면 위치 정의
    <div className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50'>
      {/* 모달 크기 정의 */}
      <div className='flex flex-col items-center bg-white rounded-lg w-[800px] h-[800px] border rounded-lg'>
        <header className='flex justify-between items-center w-full text-xl mb-4 h-[10%] bg-blue-100'>
          <div className='ml-4'>Create Workspace</div>
          <button className='' onClick={onClose}>
            <img className='mr-4 w-6' src='/src/assets/workspace/x.png' alt='' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex flex-col w-[400px] h-[640px]'>
          <div className='h-[35%] mb-20'>
            <div className='flex flex-col mb-1'>
              {/* WorkSpace 이름 입력 */}
              <div>WorkSpaces name</div>
              <input type='text' className='border w-full h-14 p-5 rounded-lg' placeholder='Project name' />
              <div className={`${isworkspacename ? 'visible' : 'invisible'} text-red-500`}>
                Project name을 입력해주세요.
              </div>
            </div>

            {/* Domain 주소 입력 */}
            <div className='flex flex-col mb-1'>
              <div>Domain Address</div>
              <input type='text' className='border w-full h-14 p-5 rounded-lg' placeholder='k11b305.ssafy.p.io' />
              <div className={`${isworkspacename ? 'visible' : 'invisible'} text-red-500`}>
                Domain 주소를 입력해주세요.
              </div>
            </div>

            {/* 초대할 사람 입력 */}
            <div className='flex flex-col'>
              <div>Invite a member to Project</div>
              <div className='flex justify-between items-center'>
                <input type='text' className='border w-full h-14 p-5 rounded-lg' placeholder='ssafy@ssafy.com' />
                <button className='w-20 h-14 ml-3 border rounded-lg bg-green-500 hover:bg-green-600'>Invite</button>
              </div>
            </div>
          </div>

          <div className='block h-[40%] border rounded-lg overflow-y-auto h-80 sidebar-scrollbar'>
            {/* 유저 정보 테이블 칸 */}
            {users.map((item, index) => (
              <div key={index} className='flex justify-between hover:bg-blue-300 border border-none rounded-lg'>
                <div className='flex items-center p-2'>
                  <img className='w-14 mr-4' src={item.userimg} alt='h' />
                  <div>
                    <div>{item.username}</div>
                    <div>{item.email}</div>
                  </div>
                </div>
                <button>
                  <img className='w-5 mr-5' src='/src/assets/workspace/x.png' alt='' />
                </button>
              </div>
            ))}
          </div>

          <button className='mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600' onClick={() => {}}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
