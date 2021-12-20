import { createTheme } from 'client/Themes';
import { ThemeType } from 'client/Themes/type';
import { useMemo, useState } from 'react';
import { useQuery } from 'client/Common/hooks/useQuery';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { FC } from 'react';

function useThemeInner({ initialThemeType }: { initialThemeType: ThemeType }) {
  const [themeType, setThemeType] = useState(initialThemeType);
  const storage = useStorage();
  const theme = useMemo(() => createTheme(themeType), [themeType]);
  return {
    themeType,
    theme,
    setThemeType: (newThemeType: ThemeType) => {
      setThemeType(newThemeType);
      storage.set('theme', newThemeType);
    },
  };
}

export const [InnerThemeProvider, useTheme] = constate(useThemeInner);

export const ThemeProvider: FC = ({ children }) => {
  const storage = useStorage();
  const query = useQuery();
  const initialTheme = useMemo(() => {
    let theme = query.theme;
    if (!theme) {
      // @ts-expect-error works
      theme = ThemeType[storage.get('theme')];
      if (!theme) {
        theme = globalThis.matchMedia?.('(prefers-color-scheme: light)').matches
          ? ThemeType.light
          : ThemeType.dark;
        if (theme === ThemeType.light) {
          storage.set('theme', theme);
        }
      }
    }
    return (theme as ThemeType) || ThemeType.dark;
  }, []);

  return (
    <InnerThemeProvider initialThemeType={initialTheme}>
      {children}
    </InnerThemeProvider>
  );
};
