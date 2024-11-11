import { FaEllipsisH } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const History = ({ openHistoryDetail }) => {
  const data = [
    {
      createdDate: '2024-11-09T12:00:00.000Z',
      apiId: 'fa9f27d8-28a2-47b5-9877-35c155823b57asajdkhaskljdhasdhasjdhasdasdasdasdasdasdadasdasddasdasd',
      nickname: 'user1',
    },
    {
      createdDate: '2024-11-03T12:00:00.000Z',
      apiId: 'c7e24d7f-1234-4b56-9876-78a212344def',
      nickname: 'user2',
    },
    {
      createdDate: '2024-11-09T12:00:00.000Z',
      apiId: 'b4a123d8-56f8-4a7d-bb44-12a34b7c8de9',
      nickname: 'user3',
    },
    {
      createdDate: '2024-11-09T12:00:00.000Z',
      apiId: 'd9f237b8-1234-4f98-a77b-43c255823f45',
      nickname: 'user4',
    },
    {
      createdDate: '2024-11-09T12:00:00.000Z',
      apiId: 'e8a237c9-7890-4d7e-b12f-56d3448b9a12',
      nickname: 'user5',
    },
    {
      createdDate: '2024-11-09T12:00:00.000Z',
      apiId: 'f5a237d1-1234-4a9c-bb77-98c144823d56',
      nickname: 'user6',
    },
    {
      createdDate: '2024-11-03T12:00:00.000Z',
      apiId: 'a1b237c8-5678-4e7d-b89f-34b244823e78',
      nickname: 'user7',
    },
    {
      createdDate: '2024-11-02T12:00:00.000Z',
      apiId: 'c6e347d7-4567-4f5b-987c-12a444823f89',
      nickname: 'user8',
    },
    {
      createdDate: '2024-11-01T12:00:00.000Z',
      apiId: 'd2f347d9-6789-4d5c-a12b-67d244823a90',
      nickname: 'user9',
    },
    {
      createdDate: '2024-10-09T12:00:00.000Z',
      apiId: 'b3a247e1-7890-4a5b-c98f-89d124823e34',
      nickname: 'user10',
    },
  ];

  const handleHistory = (apiId) => {
    console.log(apiId);
  };

  return (
    <div className='w-full flex flex-col mb-4 overflow-y-auto  overflow-x-hidden sidebar-scrollbar'>
      <p className='text-2xl font-bold mb-4'>API History</p>
      <hr className='border-t border-gray-300 mb-3 w-full' />
      {data?.length === 0 ? (
        <p className='text-[#666666]'>No History</p>
      ) : (
        data
          .slice()
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .map((history) => (
            <div
              key={history.apiId}
              onClick={() => openHistoryDetail(history.apiId)}
              className='w-full flex flex-row text-[#666666] mt-4 border rounded-lg p-1'
            >
              <div className='w-full flex flex-col ml-1 p-3'>
                <div className='flex flex-row'>
                  <p className='break-words max-w-[100%]'>API ID : {history.apiId}</p> {/* 스타일 추가 */}
                </div>
                <div className='flex flex-row'>
                  <p>명세 확정일 : </p>
                  <span className='text-sm mx-1 mt-0.5'>
                    {new Date(history.createdDate).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p>명세 확정자 : {history.nickname}</p>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default History;
