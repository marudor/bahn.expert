import { useCallback, useState } from 'react';

export const useToggleState = (defaultValue = false): [boolean, () => void] => {
  const [state, setState] = useState(defaultValue);
  const toggleState = useCallback(() => setState((old) => !old), []);

  return [state, toggleState];
};
