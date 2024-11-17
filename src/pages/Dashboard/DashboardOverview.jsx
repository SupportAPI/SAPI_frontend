import { useState } from 'react';
import ApiDevelopmentStatus from './ApiDevelopmentStatus';
import ApiDevelopmentProgress from './ApiDevelopmentProgress';
import { useFetchDashboardList } from '../../api/queries/useApiDashboardQueries';

const DashboardOverview = () => {
  const { data = {}, error, refetch } = useFetchDashboardList(); // 기본값을 빈 객체로 설정

  console.log('데이터', data);

  return (
    <div className='p-8 h-screen overflow-y-scroll dark:bg-dark-background dark:text-dark-text sidebar-scrollbar'>
      <div>
        <p className='text-2xl font-bold'>API Dashboard</p>
        <hr className='border-t mt-1 mb-8' />
      </div>
      <div
        className='grid gap-4'
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}
      >
        <ApiDevelopmentStatus
          data={data.userLocalSuccessCount || 0} // 기본값을 0으로 설정
          maxValue={data.totalSpecifications || 0}
          title={'로컬 내 API 완성'}
        />
        <ApiDevelopmentStatus
          data={data.userServerSuccessCount || 0}
          maxValue={data.totalSpecifications || 0}
          title={'서버 내 API 완성'}
        />
        <ApiDevelopmentStatus
          data={data.localSuccessCount || 0}
          maxValue={data.totalSpecifications || 0}
          title={'로컬 전체 API 완성'}
        />
        <ApiDevelopmentStatus
          data={data.serverSuccessCount || 0}
          maxValue={data.totalSpecifications || 0}
          title={'서버 전체 API 완성'}
        />
      </div>

      <div>
        <p className='text-2xl font-bold'>Completed API Count Progress</p>
        <hr className='border-t mt-1 mb-5 border-black' />
      </div>

      <div
        className='grid gap-4'
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}
      >
        <ApiDevelopmentProgress recentStatistics={data.recentStatistics || []} />
      </div>
    </div>
  );
};

export default DashboardOverview;
