import { createContainer } from 'unstated-next';
import { ReactNode, useMemo, useState } from 'react';
import { ThemeType } from 'client/Themes/type';
import createTheme from 'client/Themes';
import useQuery from 'client/Common/hooks/useQuery';
import useStorage from 'shared/hooks/useStorage';
import type StorageInterface from 'shared/hooks/useStorage/StorageInterface';

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
    // @ts-ignore
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
