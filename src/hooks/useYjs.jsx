import { useContext } from 'react';
import { YjsProvider } from '../contexts/YjsProvider';
export const useYjs = () => {
  const context = useContext(YjsProvider);
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider');
  }
  return context;
};
