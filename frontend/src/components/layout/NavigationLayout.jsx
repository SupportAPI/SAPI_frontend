import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import TabBar from '../Tabbar';
import TabContent from '../TabContent';

const NavigationLayout = () => {
  return (
    <div className='flex flex-1 overflow-hidden'>
      <Navbar />
      <div className='h-full'>
        <Sidebar />
      </div>
      <div className='flex-1 flex flex-col'>
        <TabBar />
        <TabContent />
      </div>
    </div>
  );
};

export default NavigationLayout;
