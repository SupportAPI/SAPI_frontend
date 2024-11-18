import { useEffect } from 'react';
import useThemeStore from '../../stores/useThemeStore';

const SettingThemee = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, [setTheme]);

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-2xl mb-5'>Theme</div>
        <div className='border'></div>
        <div className="flex justify-center items-center bg-light-background dark:bg-dark-background mt-10 p-5">
          <div
            className={`relative w-32 h-16 bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all cursor-pointer`}
            onClick={handleToggle}
          >
            {/* 토글 버튼 */}
            <div
              className={`absolute top-1 w-14 h-14 bg-white dark:bg-black rounded-full shadow-md transition-transform ${
                theme === 'light' ? 'translate-x-0' : 'translate-x-16'
              }`}
            ></div>

            {/* Light 아이콘 (해 모양) */}
            <div className="absolute left-3 top-3 text-yellow-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m16.364-7.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05l-1.414-1.414M12 6.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z"
                />
              </svg>
            </div>

            {/* Dark 아이콘 (달 모양) */}
            <div className="absolute right-3 top-3 text-gray-400 dark:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0112.002 22C6.476 22 2 17.523 2 12.002A9.718 9.718 0 018.998 2.248 7.501 7.501 0 0021.752 15.002z"
                />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-lg text-center">
            Current Theme: <span className="font-semibold capitalize">{theme}</span>
          </p>
      </div>
    </div>
  );
};

export default SettingThemee;
