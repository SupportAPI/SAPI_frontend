import { FaEllipsisH } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useFetchApiHistoryList } from '../../../api/queries/useApiHistory';
import { useParams } from 'react-router';

const History = ({ openHistoryDetail, docId }) => {
  const { workspaceId } = useParams();
  const {
    data: historyData = null,
    isLoading: isHistoryLoading = false,
    error: isDataError = null,
    refetch: historyRefetch,
  } = docId ? useFetchApiHistoryList(workspaceId, docId) : {};

  console.log(historyData);

  const handleHistory = (apiId) => {
    console.log(apiId);
  };

  return (
    <div className='w-full flex flex-col mb-4 overflow-y-auto  overflow-x-hidden sidebar-scrollbar'>
      <p className='text-2xl font-bold mb-4'>API History</p>
      <hr className='border-t border-gray-300 mb-3 w-full' />
      {historyData?.length === 0 || !historyData ? (
        <p className='text-[#666666]'>No History</p>
      ) : (
        historyData
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
                <div className='flex flex-row'>
                  <p className='break-words max-w-[100%]'>명세 확정자 : {history.userNickname}</p> {/* 스타일 추가 */}
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default History;
