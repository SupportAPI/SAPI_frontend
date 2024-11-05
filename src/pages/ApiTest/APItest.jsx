import { useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md'; // 빈박스
import { MdOutlineCheckBox } from 'react-icons/md'; // 체크 박스

const ApiTest = () => {
  const data = [
    {
      id: '011251e0-1083-42b2-9ca6-cba4427e14d2',
      category: '',
      name: '',
      method: 'GET',
      path: '',
      nickname: '',
      bodyType: 'NONE',
      authenticationType: 'NOAUTH',
      localStatus: 'PENDING',
      serverStatus: 'PENDING',
    },
    {
      id: '6d29b036-1a2e-45a7-ac48-b591015ab166',
      category: '',
      name: '',
      method: 'GET',
      path: '',
      nickname: '',
      bodyType: 'NONE',
      authenticationType: 'NOAUTH',
      localStatus: 'PENDING',
      serverStatus: 'PENDING',
    },
    {
      id: '8d09c7ce-5b4e-4e90-af0c-e45c319acd12',
      category: '',
      name: '',
      method: 'GET',
      path: '',
      nickname: '',
      bodyType: 'NONE',
      authenticationType: 'NOAUTH',
      localStatus: 'PENDING',
      serverStatus: 'PENDING',
    },
  ];

  const [totalAPI, setTotalAPI] = useState(120);

  return (
    <div className='flex flex-col p-8 h-screen overflow-y-scroll'>
      <div>
        <p className='text-2xl font-bold'>API Test</p>
        <hr className='border-t mt-1 mb-8 border-black' />
      </div>
      <div className='grid grid-cols-4 border-2'>
        {/* Local 및 Test 버전 선택하는 버튼 */}
        <div>44</div>
        {/* URL 검새갈 수 있는 input box */}
        <div>23</div>
        {/* test 버튼 */}
        <div>123</div>
        <hr />
        <br></br>
        <br></br>
      </div>

      {/* 테이블이 들어갈 공간 */}
      <div className=''>
        <table className='w-full min-w-[1200px] custom-table border rounded-lg bg-gray-100'>
          <thead>
            <tr className='text-left border-b'>
              <th className='w-[100px]'>
                <MdCheckBoxOutlineBlank />
              </th>
              <th>Category</th>
              <th>API Name</th>
              <th>HTTP Method</th>
              <th>API Path</th>
              <th>Description</th>
              <th>Manager</th>
              <th>LS</th>
              <th>SS</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiTest;
