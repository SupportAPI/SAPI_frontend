function App() {
  const table = [
    { 프로젝트: 'SAPI', description: 'SSAFY 자율 프로젝트', ActiveUser: '1/6', TeamID: '26', UpdateDate: '6/3/22' },
    { 프로젝트: 'DayLog', description: 'SSAFY 공통 프로젝트', ActiveUser: '1/6', TeamID: '26', UpdateDate: '6/3/22' },
    {
      프로젝트: 'Hello, Word',
      description: 'SSAFY 특화 프로젝트',
      ActiveUser: '1/6',
      TeamID: '26',
      UpdateDate: '6/3/22',
    },
    { 프로젝트: 'FIFI', description: 'SSAFY 관통 프로젝트', ActiveUser: '1/6', TeamID: '26', UpdateDate: '6/3/22' },
  ];

  return (
    <div className='p-20 bg-blue-50'>
      <div className='flex flex-col w-full'>
        {/* 제목과 워크스페이스가 들어갈 공간 */}
        <section className='flex justify-between items-center mb-8'>
          <p className='text-3xl font-bold'>Workspaces</p>
          {/* 누르면 워크스페이스 확장 모달 띄우기 */}
          <button className='border border-black p-2 rounded-md bg-blue-500 text-white hover:bg-blue-300'>
            + Add WorkSpaces
          </button>
        </section>

        {/* In Progress가 들어갈 공간 */}
        <section className='flex flex-col border border-black w-full rounded-md bg-white p-8'>
          <div className='flex justify-between items-center mb-5'>
            <p className='font-bold text-2xl'>In Progress</p>
            <button className='flex items-center justify-center border border-black rounded-full w-8 h-8 bg-gray-100'>
              -
            </button>
          </div>
          {/* 가로 바 */}
          <div className='border mt-2 mb-2 w-full'></div>

          {/* 여기에 진행중인 워크 스페이스 항목 넣기 */}
          <div className='flex flex-row justify-between'>
            {/* 돋보기랑 서치박스 */}
            <div className='flex flex-row'>
              <div>🍳</div>
              <input className='ml-2 border-b' type='text' />
            </div>
            <div className='flex flex-row items-center'>
              <p className='mr-2'>Active User</p>
              <div className='flex flex-col'>
                <button className='text-xs'>△</button>
                <button className='text-xs'>▽</button>
              </div>
            </div>
            <div className='flex flex-row items-center'>
              <p className='mr-2'>Team ID</p>
              <div className='flex flex-col'>
                <button className='text-xs'>△</button>
                <button className='text-xs'>▽</button>
              </div>
            </div>
            <div className='flex flex-row items-center'>
              <p className='mr-2'>Update Date</p>
              <div className='flex flex-col'>
                <button className='text-xs'>△</button>
                <button className='text-xs'>▽</button>
              </div>
            </div>
            <div className='flex flex-row items-center'>
              <p className='mr-2'>Options</p>
              <div className='flex flex-col'>
                <button className='text-xs'>△</button>
                <button className='text-xs'>▽</button>
              </div>
            </div>
          </div>

          <div></div>
        </section>

        {/* Done이 들어갈 공간 */}
        <section></section>
      </div>
    </div>
  );
}

export default App;
