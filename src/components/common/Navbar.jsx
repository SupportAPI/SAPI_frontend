import { FaBook, FaFlask, FaTachometerAlt } from 'react-icons/fa';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className='w-20 bg-[#F0F5F8] h-full flex flex-col items-center py-4 border-r'>
      <ul className='w-full flex-1'>
        <li className='flex flex-col items-center mb-4'>
          <div
            className='flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] bg-gray-200'
            onClick={() => onMenuClick('API Docs')}
          >
            <FaBook className='text-2xl mb-2 text-[#475467]' />
            <span className='text-[10px]'>API Docs</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center mb-4'>
          <div
            className='flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] hover:bg-gray-200'
            onClick={() => onMenuClick('API Test')}
          >
            <FaFlask className='text-2xl mb-2 text-[#475467]' />
            <span className='text-[10px]'>API Test</span>
          </div>
          <div className='w-14 border-b border-gray-300 mt-2'></div>
        </li>
        <li className='flex flex-col items-center'>
          <div
            className='flex cursor-pointer flex-col items-center justify-center w-16 h-16 p-2 rounded-lg text-[#475467] hover:bg-gray-200'
            onClick={() => onMenuClick('Dashboard')}
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
