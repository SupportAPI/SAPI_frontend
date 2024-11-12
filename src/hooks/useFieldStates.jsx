import { useState } from 'react';

export const useFieldStates = (initialData) => {
  const [state, setState] = useState(initialData);

  const setField = (path, value) => {
    setState((prevState) => {
      if (path.length === 0) {
        return value;
      }

      const newState = { ...prevState };
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  return [state, setField];
};
