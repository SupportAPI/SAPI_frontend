import { useQuery } from 'react-query';
import Header from '../common/Header';
import Navbar from '../common/Navbar';
import ApiDocsSidebar from '../sidebar/ApiDocsSidebar';
import ApiTestSidebar from '../sidebar/ApiTestSidebar';
import DashboardSidebar from '../sidebar/DashboardSidebar';
import TabBar from '../common/TabBar';
import { useNavbarStore } from '../../stores/useNavbarStore';
import EnvironmentSidebar from '../sidebar/EnvironmentSidebar';
import Environment from '../common/Environment';
import { useParams } from 'react-router-dom';

const Layout = ({ children }) => {
  const { workspaceId } = useParams();
  const { menu, setMenu, setApiData, apiData } = useNavbarStore();

  const { refetch } = useQuery(
    ['apiData', menu],
    async () => {
      const response = await fetch('/api/specifications');
      const data = await response.json();
      setApiData(data);
      return data;
    },
    {
      enabled: false,
    }
  );

  const handleMenuClick = (menu) => {
    setMenu(menu);
    if (menu === 'API Docs' || menu === 'API Test') {
      refetch();
    }
  };

  const renderSidebar = () => {
    switch (menu) {
      case 'API Docs':
        return <ApiDocsSidebar data={apiData} />;
      case 'Environment':
        return <EnvironmentSidebar />;
      case 'API Test':
        return <ApiTestSidebar data={apiData} />;
      case 'Dashboard':
        return <DashboardSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <Navbar onMenuClick={handleMenuClick} />
        <div className='h-full'>{renderSidebar()}</div>
        <div className='flex-1 flex flex-col'>
          <div className='flex flex-row justify-between dark:bg-dark-background'>
            <TabBar />
            <Environment workspaceId={workspaceId} />
          </div>
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
