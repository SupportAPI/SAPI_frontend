import { useState } from 'react';

const SettingThemee = () => {
  const [selectedTheme, setSelectedTheme] = useState('White'); // 현재 선택된 테마 상태

  const handleSelect = (theme) => {
    setSelectedTheme(theme);
  };

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-2xl font-semibold mb-5'>Theme</div>
        <div className='border'></div>

        <div className='flex flex-col mt-10'>
          <div className='flex m-10'>
            <button
              onClick={() => handleSelect('White')}
              className={`border rounded-full w-7 h-7 mr-4 text-2xl ${
                selectedTheme === 'White' ? 'bg-blue-500 border-blue-500' : 'border-gray-400 hover:bg-blue-300'
              }`}
            ></button>
            <div className={`${selectedTheme === 'White' ? 'text-blue-500' : 'text-gray-700'}`}>White</div>
          </div>

          <div className='flex m-10'>
            <button
              onClick={() => handleSelect('Black')}
              className={`border rounded-full w-7 h-7 mr-4 text-2xl ${
                selectedTheme === 'Black' ? 'bg-blue-500 border-blue-500' : 'border-gray-400 hover:bg-blue-300'
              }`}
            ></button>
            <div className={`${selectedTheme === 'Black' ? 'text-blue-500' : 'text-gray-700'}`}>Black</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingThemee;
