import { useState } from 'react';
import { FaBook, FaFlask, FaTachometerAlt } from 'react-icons/fa';

const Navbar = ({ onMenuClick }) => {
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
    <nav className='w-20 bg-[#F0F5F8] h-full flex flex-col items-center py-4 border-r'>
      <ul className='flex-1 w-20'>
        <li className='flex flex-col items-center mb-4'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] ${
              selectedMenu === 'API Docs' ? 'bg-gray-300' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleMenuClick('API Docs')}
          >
            <FaBook className='text-2xl mb-2 text-[#475467]' />
            <span className='text-[10px]'>API Docs</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center mb-4'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] ${
              selectedMenu === 'API Test' ? 'bg-gray-300' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleMenuClick('API Test')}
          >
            <FaFlask className='text-2xl mb-2 text-[#475467]' />
            <span className='text-[10px]'>API Test</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center'>
          <div
            className={`flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] ${
              selectedMenu === 'Dashboard' ? 'bg-gray-300' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleMenuClick('Dashboard')}
          >
            <FaTachometerAlt className='text-2xl mb-2 text-[#475467]' />
            <span className='text-[10px]'>Dashboard</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
