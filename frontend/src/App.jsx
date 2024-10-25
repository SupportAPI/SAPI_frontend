import { useState } from 'react';
import CreateWorkspace from './CreateWorkspace';
import Settings from './Settings';

function App() {
  // CreateWorkspace 모달 관리
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Settings 모달 열기 (임기)
  const [isOpenModal2, setIsOpenModal2] = useState(false);

  // table 목록 view 상태 관리
  const [isP_TableVisible, setP_IsTableVisible] = useState(true);
  const [isD_TableVisible, setD_IsTableVisible] = useState(true);

  // table Sort 관리
  const [isSortPOrder, setIsSortPOrder] = useState({ column: '', direction: 'asc' });
  const [isSortDOrder, setIsSortDOrder] = useState({ column: '', direction: 'asc' });

  // 프로젝트별 Setting view 상태 관리 (일단 대기)
  const [isViewSetting, setisViewSetting] = useState(false);

  // Prograss 정렬 함수
  const sortPTable = (column) => {
    const direction = isSortPOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...prograssTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setPrograssTable(sortedData);
    setIsSortPOrder({ column, direction });
  };

  // Done 정렬 함수
  const sortDTable = (column) => {
    const direction = isSortDOrder.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...doneTable].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setdoneTable(sortedData);
    setIsSortDOrder({ column, direction });
  };

  // Setting View 함수

  const [prograssTable, setPrograssTable] = useState([
    {
      id: 1,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      ActiveUser: '1/6',
      TeamID: 13,
      UpdateDate: '6/1/22',
    },
    {
      id: 2,
      imgg: '/src/assets/logo2.png',
      프로젝트: 'DayLog',
      description: 'SSAFY 공통 프로젝트',
      ActiveUser: '2/6',
      TeamID: 14,
      UpdateDate: '6/2/22',
    },
    {
      id: 3,
      imgg: '/src/assets/logo3.png',
      프로젝트: 'Hello, Word',
      description: 'SSAFY 특화 프로젝트',
      ActiveUser: '3/6',
      TeamID: 15,
      UpdateDate: '6/3/22',
    },
    {
      id: 4,
      imgg: '/src/assets/logo4.png',
      프로젝트: 'FIFI',
      description: 'SSAFY 관통 프로젝트',
      ActiveUser: '4/6',
      TeamID: 17,
      UpdateDate: '6/4/22',
    },
    {
      id: 5,
      imgg: '/src/assets/logo4.png',
      프로젝트: 'FIFI',
      description: 'SSAFY 관통 프로젝트',
      ActiveUser: '5/6',
      TeamID: 19,
      UpdateDate: '6/5/22',
    },
    {
      id: 6,
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
      id: 7,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '1/6',
      ChargebeeID: 1,
      RenewalDate: '6/3/22',
    },
    {
      id: 8,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '2/6',
      ChargebeeID: 2,
      RenewalDate: '6/4/22',
    },
    {
      id: 9,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '4/6',
      ChargebeeID: 5,
      RenewalDate: '6/3/22',
    },
    {
      id: 11,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '3/6',
      ChargebeeID: 4,
      RenewalDate: '6/11/22',
    },
    {
      id: 12,
      imgg: '/src/assets/logo1.png',
      프로젝트: 'SAPI',
      description: 'SSAFY 자율 프로젝트',
      User: '2/6',
      ChargebeeID: 5,
      RenewalDate: '6/3/22',
    },
    {
      id: 13,
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
      <button className='h-16 bg-blue-300 text-center' onClick={() => setIsOpenModal2(true)}>
        세팅열기
      </button>
      <div className='flex flex-col w-[1400px] mx-auto'>
        <div className='p-8'>
          <div className='flex flex-col mx-auto'>
            {/* 제목과 워크스페이스가 들어갈 공간 */}
            <section className='flex justify-between items-center mb-8'>
              <p className='text-3xl'>Workspaces</p>
              {/* 누르면 워크스페이스 확장 모달 띄우기 */}
              <button
                className='border p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500'
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                + Add WorkSpaces
              </button>
            </section>

            {isOpenModal && <CreateWorkspace onClose={() => setIsOpenModal(false)}></CreateWorkspace>}
            {isOpenModal2 && <Settings onClose={() => setIsOpenModal2(false)}></Settings>}

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
              <div className={`custom-table-move ${isP_TableVisible ? 'show' : ''}`}>
                {/* 여기에 진행중인 워크 스페이스 항목 넣기 */}
                <div className='h-96'>
                  <table className='w-full custom-table'>
                    <thead>
                      <tr className='text-left border-b'>
                        <th className='p-2 w-[20%]'>
                          <div className='flex items-center'>
                            <div>🍳</div>
                            <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <button
                              className='flex justify-center items-center'
                              onClick={() => sortPTable('ActiveUser')}
                            >
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>Active User</p>
                              {isSortPOrder.column === 'ActiveUser' && isSortPOrder.direction === 'asc' ? '▲' : '▼'}
                            </button>
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <button className='flex justify-center items-center' onClick={() => sortPTable('TeamID')}>
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>Team ID</p>
                              {isSortPOrder.column === 'TeamID' && isSortPOrder.direction === 'asc' ? '▲' : '▼'}
                            </button>
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <button
                              className='flex justify-center items-center'
                              onClick={() => sortPTable('UpdateDate')}
                            >
                              <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>Update Date</p>
                              {isSortPOrder.column === 'UpdateDate' && isSortPOrder.direction === 'asc' ? '▲' : '▼'}
                            </button>
                          </div>
                        </th>
                        <th className='p-2 w-[20%]'>
                          <div className='flex justify-center items-center'>
                            <p className='pr-2 py-2'>Option</p>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className='block overflow-y-auto h-80 sidebar-scrollbar'>
                      {prograssTable.map((item, index) => (
                        <tr key={index} className='border-b'>
                          <td className='p-2 w-[20%]'>
                            <button className='flex ml-3 hover:bg-gray-50 rounded-xl'>
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
            </section>

            {/* Done이 들어갈 공간 */}
            {/* Done이 들어갈 공간 */}

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
              <div className={`custom-table-move ${isD_TableVisible ? 'show' : ''}`}>
                <div>
                  {/* 여기에 끝난 워크 스페이스 항목 넣기 */}
                  <div className='h-96'>
                    <table className='w-full custom-table'>
                      <thead>
                        <tr className='text-left border-b'>
                          <th className='p-2 w-[20%]'>
                            <div className='flex items-center'>
                              <div>🍳</div>
                              <input className='ml-2 border-b font-normal' type='text' placeholder='Search' />
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <button className='flex justify-center items-center' onClick={() => sortDTable('User')}>
                                <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>User</p>
                                {isSortDOrder.column === 'User' && isSortDOrder.direction === 'asc' ? '▲' : '▼'}
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <button
                                className='flex justify-center items-center'
                                onClick={() => sortDTable('ChargebeeID')}
                              >
                                <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>CHARGEBEE ID</p>
                                {isSortDOrder.column === 'ChargebeeID' && isSortDOrder.direction === 'asc' ? '▲' : '▼'}
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <button
                                className='flex justify-center items-center'
                                onClick={() => sortDTable('RenewalDate')}
                              >
                                <p className='mr-2 bg-gray-100 px-4 py-2 rounded-3xl hover:bg-gray-200'>RENEWAL DATE</p>
                                {isSortDOrder.column === 'RenewalDate' && isSortDOrder.direction === 'asc' ? '▲' : '▼'}
                              </button>
                            </div>
                          </th>
                          <th className='p-2 w-[20%]'>
                            <div className='flex justify-center items-center'>
                              <p className='pr-2 py-2'>Option</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className='block overflow-y-auto h-80 sidebar-scrollbar'>
                        {doneTable.map((item, index) => (
                          <tr key={index} className='border-b'>
                            <td className='p-2 w-[20%]'>
                              <button className='flex ml-3 hover:bg-gray-50 rounded-xl'>
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
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
