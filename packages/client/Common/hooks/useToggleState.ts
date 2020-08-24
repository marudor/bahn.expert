import { useMemo, useState } from 'react';

export const useToggleState = (
  defaultValue: boolean = false,
): [boolean, () => void] => {
  const [state, setState] = useState(defaultValue);
  const toggleState = useMemo(() => () => setState((old) => !old), []);

  return [state, toggleState];
};
