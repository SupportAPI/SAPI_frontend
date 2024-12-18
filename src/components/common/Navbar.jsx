import { useState } from 'react';
import { FaBook, FaListAlt, FaFlask, FaTachometerAlt } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menu) => {
    if (selectedMenu === menu) {
      // 같은 메뉴를 다시 클릭하면 닫히도록 설정
      setSelectedMenu(null);
      onMenuClick(null); // 메뉴 닫기
    } else {
      setSelectedMenu(menu);
      onMenuClick(menu); // 메뉴 열기
    }
  };

  return (
    <nav className='w-20 bg-[#F0F5F8] h-full flex flex-col items-center py-4 border-r dark:bg-dark-background'>
      <ul className='flex-1 w-20'>
        <li className='flex flex-col items-center mb-4'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] dark:text-dark-text ${
              selectedMenu === 'API Docs' ? 'bg-gray-300 dark:bg-black' : 'hover:bg-gray-200 dark:hover:bg-black'
            }`}
            onClick={() => handleMenuClick('API Docs')}
          >
            <FaBook className='text-2xl mb-2 text-[#475467] dark:text-dark-text' />
            <span className='text-[10px]'>API Docs</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center mb-4'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] dark:text-dark-text ${
              selectedMenu === 'Environment' ? 'bg-gray-300 dark:bg-black' : 'hover:bg-gray-200 dark:hover:bg-black'
            }`}
            onClick={() => handleMenuClick('Environment')}
          >
            <FaListAlt className='text-2xl mb-2 text-[#475467] dark:text-dark-text' />
            <span className='text-[10px]'>Environment</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center mb-4'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] dark:text-dark-text ${
              selectedMenu === 'API Test' ? 'bg-gray-300 dark:bg-black' : 'hover:bg-gray-200 dark:hover:bg-black'
            }`}
            onClick={() => handleMenuClick('API Test')}
          >
            <FaFlask className='text-2xl mb-2 text-[#475467] dark:text-dark-text' />
            <span className='text-[10px]'>API Test</span>
          </div>
          {/* <div className='w-14 border-b border-gray-300 mt-2'></div> */}
        </li>
        {/* <li className='flex flex-col items-center'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] dark:text-dark-text ${
              selectedMenu === 'Dashboard' ? 'bg-gray-300 dark:bg-black' : 'hover:bg-gray-200 dark:hover:bg-black'
            }`}
            onClick={() => handleMenuClick('Dashboard')}
          >
            <FaTachometerAlt className='text-2xl mb-2 text-[#475467] dark:text-dark-text' />
            <span className='text-[10px]'>Dashboard</span>
          </div>
        </li> */}
      </ul>
      <button onClick={() => navigate('/workspaces')}>
        <TbLogout2 className='text-3xl m-5 text-[#475467] dark:text-dark-text' />
      </button>
    </nav>
  );
};

export default Navbar;
