import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import DashboardCompletedProgress from './Dashboard/ApiDevelopmentProgress';
import { useFetchDashboardList } from '../api/queries/useApiDashboardQueries';
import { useParams } from 'react-router';

ChartJS.register(ArcElement, Tooltip, Legend);

const Workspace = () => {
  const { data = {}, error, refetch } = useFetchDashboardList(); // 기본값을 빈 객체로 설정
  const { workspaceId } = useParams();
  const mockData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ['#F7FAFB', '#D1D5DB'], // 포인트 색상과 대비되는 색
        hoverBackgroundColor: ['#E2E8F0', '#A0AEC0'], // 포인트 색상보다 약간 어두운 색
      },
    ],
  };

  return (
    <div className='flex flex-col p-16 items-center justify-center'>
      {/* 상단: 차트 2개와 버튼 */}
      <h1 className='text-4xl font-extrabold w-full text-gray-800'>HOME</h1>
      <div className='w-[85%] flex items-center justify-between'>
        <div className='flex gap-32 justify-center py-8'>
          <div className='w-80 h-80'>
            <Doughnut data={mockData} />
            <div className='text-center text-[20px]'>Local API Status</div>
          </div>
          <div className='w-80 h-80'>
            <Doughnut data={mockData} />
            <div className='text-center text-[20px]'>Server API Status</div>
          </div>
        </div>

        <div className='flex flex-col flex-wrap justify-center gap-6 py-6'>
          <Link
            to={`/workspace/${workspaceId}/apidocs/all`}
            className='px-12 py-6 bg-gray-50 text-xl font-bold rounded-lg shadow-lg hover:bg-gray-100 transition w-[300px] h-[150px] flex items-center justify-center'
          >
            Go to API Docs
          </Link>
          <Link
            to={`/workspace/${workspaceId}/api-test`}
            className='px-12 py-6 bg-gray-50 text-xl font-bold rounded-lg shadow-lg hover:bg-gray-100 transition w-[300px] h-[150px] flex items-center justify-center'
          >
            Go to API Test
          </Link>
        </div>
      </div>

      {/* 하단: 대시보드 */}
      <div className='bg-white w-[85%] mt-4'>
        <DashboardCompletedProgress recentStatistics={data.recentStatistics || []} />
      </div>
    </div>
  );
};

export default Workspace;
