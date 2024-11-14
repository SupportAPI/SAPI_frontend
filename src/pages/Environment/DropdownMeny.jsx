import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const DropdownMenu = ({ onClose, position, setIsSecreted }) => {
  const menuRef = useRef(null);

  const sendIsSecreted = (isSecreted) => {
    setIsSecreted(isSecreted);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <ul
      ref={menuRef}
      className='absolute bg-white shadow-lg w-32 text-left z-50 border border-gray-200'
      style={{ top: position.top, left: position.left }}
    >
      <li className='p-2 hover:bg-gray-100 cursor-pointer text-center' onClick={() => sendIsSecreted('SECRET')}>
        Secret
      </li>
      <li className='p-2 hover:bg-gray-100 cursor-pointer text-center' onClick={() => sendIsSecreted('DEFAULT')}>
        Default
      </li>
    </ul>
  );
};

export default DropdownMenu;
