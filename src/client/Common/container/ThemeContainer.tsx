import { createContainer } from 'unstated-next';
import { ThemeType } from 'client/Themes/type';
import createTheme from 'client/Themes';
import React, { ReactNode, useMemo, useState } from 'react';
import StorageInterface from 'shared/hooks/useStorage/StorageInterface';
import useQuery from 'Common/hooks/useQuery';
import useStorage from 'shared/hooks/useStorage';

function setTheme(
  setFn: ((themeType: ThemeType) => void) | undefined,
  storage: StorageInterface,
  themeType: ThemeType
) {
  if (setFn) {
    setFn(themeType);
  }
  storage.set('theme', themeType);
}

function useTheme(initialThemeType: ThemeType = ThemeType.light) {
  const [themeType, setThemeType] = useState(initialThemeType);
  const storage = useStorage();
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  return {
    themeType,
    setTheme: setTheme.bind(undefined, setThemeType, storage),
    theme,
  };
}

const ThemeContainer = createContainer(useTheme);

export default ThemeContainer;

interface Props {
  children: ReactNode;
}
export const ThemeProvider = ({ children }: Props) => {
  const storage = useStorage();
  let initialTheme;
  const query = useQuery();

  initialTheme = query.theme;

  if (!initialTheme) {
    // @ts-expect-error
    initialTheme = ThemeType[storage.get('theme')];
    if (!initialTheme && !global.SERVER) {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeType.dark
        : ThemeType.light;
      setTheme(undefined, storage, initialTheme);
    }
  }

  return (
    <ThemeContainer.Provider initialState={initialTheme}>
      {children}
    </ThemeContainer.Provider>
  );
};
