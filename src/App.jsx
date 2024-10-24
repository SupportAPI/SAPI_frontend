import { useState } from 'react';

function App() {
  const [isP_TableVisible, setP_IsTableVisible] = useState(true);
  const [isD_TableVisible, setD_IsTableVisible] = useState(true);

  const [sortPOrder, setSortPOrder] = useState({ column: '', direction: 'asc' });
  const [sortDOrder, setSortDOrder] = useState({ column: '', direction: 'asc' });

  // Prograss 정렬 함수
  const sortPTable = (column) => {
    const direction = sortPOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...prograssTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setPrograssTable(sortedData);
    setSortPOrder({ column, direction });
  };

  // Done 정렬 함수
  const sortDTable = (column) => {
    const direction = sortDOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...doneTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setdoneTable(sortedData);
    setSortDOrder({ column, direction });
  };

  const [prograssTable, setPrograssTable] = useState([
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      ActiveUser: '1/6',
      TeamID: 13,
      UpdateDate: '6/1/22',
    },
    {
      imgg: '/src/assets/logo2.png',
      프로젝트: 'DayLog',
      description: 'SSAFY 공통 프로젝트',
      ActiveUser: '2/6',
      TeamID: 14,
      UpdateDate: '6/2/22',
    },
    {
      imgg: '/src/assets/logo3.png',
      프로젝트: 'Hello, Word',
      description: 'SSAFY 특화 프로젝트',
      ActiveUser: '3/6',
      TeamID: 15,
      UpdateDate: '6/3/22',
    },
    {
      imgg: '/src/assets/logo4.png',
      프로젝트: 'FIFI',
      description: 'SSAFY 관통 프로젝트',
      ActiveUser: '4/6',
      TeamID: 17,
      UpdateDate: '6/4/22',
    },
    {
      imgg: '/src/assets/logo4.png',
      프로젝트: 'FIFI',
      description: 'SSAFY 관통 프로젝트',
      ActiveUser: '5/6',
      TeamID: 19,
      UpdateDate: '6/5/22',
    },
    {
      imgg: '/src/assets/logo4.png',
      프로젝트: 'FIFI',
      description: 'SSAFY 관통 프로젝트',
      ActiveUser: '1/6',
      TeamID: 20,
      UpdateDate: '6/9/22',
    },
  ]);

  const [doneTable, setdoneTable] = useState([
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '1/6',
      ChargebeeID: 1,
      RenewalDate: '6/3/22',
    },
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '2/6',
      ChargebeeID: 2,
      RenewalDate: '6/4/22',
    },
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '4/6',
      ChargebeeID: 5,
      RenewalDate: '6/3/22',
    },
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '3/6',
      ChargebeeID: 4,
      RenewalDate: '6/11/22',
    },
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '2/6',
      ChargebeeID: 5,
      RenewalDate: '6/3/22',
    },
    {
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '1/6',
      ChargebeeID: 6,
      RenewalDate: '6/3/22',
    },
  ]);

  return (
    <div className='flex flex-col items-align bg-blue-50 h-screen'>
      {/* 헤더 위치 */}
      <header className='h-16 bg-blue-300 text-center'>헤더 위치 입니다.</header>
      <div className='flex flex-col w-[1400px] mx-auto'>
        <div className='p-8'>
          <div className='flex flex-col mx-auto'>
            {/* 제목과 워크스페이스가 들어갈 공간 */}
            <section className='flex justify-between items-center mb-8'>
              <p className='text-3xl'>Workspaces</p>
              {/* 누르면 워크스페이스 확장 모달 띄우기 */}
              <button className='border p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500'>
                + Add WorkSpaces
              </button>
            </section>

            {/* In Progress가 들어갈 공간 */}
            <section className='relative flex flex-col border rounded-3xl bg-white p-8'>
              <div className='flex justify-between items-center mb-2'>
                <p className=' text-2xl'>In Progress</p>
                <button
                  className='absolute flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200'
                  onClick={() => setP_IsTableVisible(!isP_TableVisible)}
                >
                  {isP_TableVisible ? (
                    <img className='w-4' src='/src/assets/Minus.png' alt='' />
                  ) : (
                    <img className='w-4' src='/src/assets/plus.png' alt='' />
                  )}
                </button>
              </div>
              {/* 가로 바 */}
              <div className='border mt-2 mb-2 w-full'></div>
              {isP_TableVisible && (
                <div>
                  {/* 여기에 진행중인 워크 스페이스 항목 넣기 */}
                  <div className='h-72'>
                    <table className='w-full custom-table'>
                      <thead>
                        <tr className='text-left border-b'>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row items-center'>
                              <div>🍳</div>
                              <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>Active User</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortPTable('ActiveUser')}>
                                  {sortPOrder.column === 'ActiveUser' && sortPOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>Team ID</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortPTable('TeamID')}>
                                  {sortPOrder.column === 'TeamID' && sortPOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>Update Date</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortPTable('UpdateDate')}>
                                  {sortPOrder.column === 'UpdateDate' && sortPOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            {/* Option 열도 다른 열들과 일치하게 중앙 정렬 */}
                            <div className='flex justify-center items-center'>
                              <p className='pr-2 py-2'>Option</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className='block overflow-y-auto h-64 sidebar-scrollbar'>
                        {prograssTable.map((item, index) => (
                          <tr key={index} className='border-b'>
                            <td className='p-2 w-[20%]'>
                              <button className='flex flex-row ml-3 hover:bg-gray-50 rounded-xl'>
                                {/* 아이콘 자리 */}
                                <img src={item.imgg} alt='icon' className='w-12 h-10' />
                                {/* 프로젝트와 설명 한 줄 표시 */}
                                <div className='flex flex-col ml-3'>
                                  <div className='text-left'>{item.프로젝트}</div>
                                  <div className='text-sm text-gray-500'>{item.description}</div>
                                </div>
                              </button>
                            </td>
                            <td className='p-2 w-[20%] text-center'>{item.ActiveUser}</td>
                            <td className='p-2 w-[20%] text-center'>{item.TeamID}</td>
                            <td className='p-2 w-[20%] text-center'>{item.UpdateDate}</td>
                            <td className='p-2 w-[20%] text-center'>
                              <button className='inline-block'>
                                <img className='h-6 mx-auto' src='/src/assets/3point.png' alt='' />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {/* Done이 들어갈 공간 */}
            {/* Done이 들어갈 공간 */}
            {/* Done이 들어갈 공간 */}
            {/* Done이 들어갈 공간 */}
            {/* Done이 들어갈 공간 */}

            {/* In Progress가 들어갈 공간 */}
            <section className='relative flex flex-col border w-full rounded-3xl bg-white p-8 mt-5'>
              <div className='flex justify-between items-center mb-2'>
                <p className=' text-2xl'>Done</p>
                <button
                  className='absolute flex justify-center items-center right-6 border rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200'
                  onClick={() => setD_IsTableVisible(!isD_TableVisible)}
                >
                  {isD_TableVisible ? (
                    <img className='w-4' src='/src/assets/Minus.png' alt='' />
                  ) : (
                    <img className='w-4' src='/src/assets/plus.png' alt='' />
                  )}
                </button>
              </div>
              {/* 가로 바 */}
              <div className='border mt-2 mb-2 w-full'></div>
              {isD_TableVisible && (
                <div>
                  {/* 여기에 끝난 워크 스페이스 항목 넣기 */}
                  <div className='h-72'>
                    <table className='w-full custom-table'>
                      <thead>
                        <tr className='text-left border-b'>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row items-center'>
                              <div>🍳</div>
                              <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>User</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortDTable('User')}>
                                  {sortDOrder.column === 'User' && sortDOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>CHARGEBEE ID</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortDTable('ChargebeeID')}>
                                  {sortDOrder.column === 'ChargebeeID' && sortDOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex flex-row justify-center items-center'>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl'>RENEWAL DATE</p>
                              <div className='flex flex-col'>
                                <button className='text-xs' onClick={() => sortDTable('RenewalDate')}>
                                  {sortDOrder.column === 'RenewalDate' && sortDOrder.direction === 'asc' ? '▲' : '▼'}
                                </button>
                              </div>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            {/* Option 열도 다른 열들과 일치하게 중앙 정렬 */}
                            <div className='flex justify-center items-center'>
                              <p className='pr-2 py-2'>Option</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className='block overflow-y-auto h-64 sidebar-scrollbar'>
                        {doneTable.map((item, index) => (
                          <tr key={index} className='border-b'>
                            <td className='p-2 w-[20%]'>
                              <button className='flex flex-row ml-3 hover:bg-gray-50 rounded-xl'>
                                {/* 아이콘 자리 */}
                                <img src={item.imgg} alt='icon' className='w-12 h-10' />
                                {/* 프로젝트와 설명 한 줄 표시 */}
                                <div className='flex flex-col ml-3'>
                                  <div className='text-left'>{item.프로젝트}</div>
                                  <div className='text-sm text-gray-500'>{item.description}</div>
                                </div>
                              </button>
                            </td>
                            <td className='p-2 w-[20%] text-center'>{item.User}</td>
                            <td className='p-2 w-[20%] text-center'>{item.ChargebeeID}</td>
                            <td className='p-2 w-[20%] text-center'>{item.RenewalDate}</td>
                            <td className='p-2 w-[20%] text-center'>
                              <button className='inline-block '>
                                <img className='h-6 mx-auto' src='/src/assets/3point.png' alt='' />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div></div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
