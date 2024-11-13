import { useEffect } from 'react';
import useThemeStore from '../../stores/useThemeStore';

const SettingThemee = () => {
  // Zustand에서 테마 상태와 설정 메서드 가져오기
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, [setTheme]);

  // 테마 버튼 클릭 핸들러
  const handleSelect = (theme) => {
    setTheme(theme === 'White' ? 'light' : 'dark'); // 'White'는 'light', 'Black'은 'dark'로 매핑
  };

  return (
    <div className='m-10'>
      <div className='flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
        <div className='text-2xl mb-5'>Theme</div>
        <div className='border border-light-text dark:border-dark-mutedText'></div>

        <div className='flex flex-col mt-10'>
          {/* White Theme 버튼 */}
          <div className='flex m-10'>
            <button
              onClick={() => handleSelect('White')}
              className={`border rounded-full w-7 h-7 mr-4 text-2xl ${
                theme === 'light'
                  ? 'bg-light-accent border-light-accent text-white'
                  : 'border-gray-400 hover:bg-blue-300 text-light-text'
              }`}
            ></button>
            <div className={`${theme === 'light' ? 'text-light-accent' : 'text-gray-700 dark:text-dark-mutedText'}`}>
              White
            </div>
          </div>

          {/* Black Theme 버튼 */}
          <div className='flex m-10'>
            <button
              onClick={() => handleSelect('Black')}
              className={`border rounded-full w-7 h-7 mr-4 text-2xl ${
                theme === 'dark'
                  ? 'bg-dark-accent border-dark-accent text-white'
                  : 'border-gray-400 hover:bg-blue-300 text-light-text'
              }`}
            ></button>
            <div className={`${theme === 'dark' ? 'text-dark-accent' : 'text-gray-700 dark:text-dark-mutedText'}`}>
              Black
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingThemee;
