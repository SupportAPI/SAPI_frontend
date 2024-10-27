import { FaChevronDown, FaPlus, FaSearch } from 'react-icons/fa';

const DashboardSidebar = () => {
  return (
    <div className='w-[300px] bg-[#F0F5F8]/50 h-full border-r flex flex-col text-sm'>
      <div className='p-2 sticky top-0 bg-[#F0F5F8]/50 z-10'>
        <div className='flex items-center'>
          <FaPlus className='text-gray-600 cursor-pointer mr-2' />
          <div className='flex items-center flex-1 bg-white rounded border'>
            <FaSearch className='text-gray-400 ml-2' />
            <input type='text' placeholder='Search' className='p-2 flex-1 bg-transparent outline-none' />
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto scrollbar'>
        <div>
          <div className='flex items-center px-2 py-1 text-[#475467] cursor-pointer'>
            <FaChevronDown className='mr-2' />
            Dashboard
          </div>
          <ul className='pl-4'>
            <li className='p-2 hover:bg-gray-200 cursor-pointer'>Dashboard Item 1</li>
            <li className='p-2 hover:bg-gray-200 cursor-pointer'>Dashboard Item 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
