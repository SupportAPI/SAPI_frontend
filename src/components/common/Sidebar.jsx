import { FaPlus, FaSearch, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
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
          <div className='flex items-center px-2 py-1 text-[#475467] cursor-pointer text-sm'>
            <FaChevronDown className='mr-2' />
            API Docs
          </div>
          <ul className='pl-4 text-sm'>
            <div>
              <div className='flex items-center px-2 py-1 text-[#475467] cursor-pointer'>
                <FaChevronDown className='mr-2' />
                Category
              </div>
              <ul className='pl-4'>
                <li className='flex items-center p-1 text-sm hover:bg-gray-300 cursor-pointer'>
                  <input type='checkbox' className='mr-2' />
                  API Name
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
