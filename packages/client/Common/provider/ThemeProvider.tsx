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
  let initialTheme = query.theme;
  if (!initialTheme) {
    // @ts-expect-error works
    initialTheme = ThemeType[storage.get('theme')];
    if (!initialTheme) {
      initialTheme = globalThis.matchMedia?.('(prefers-color-scheme: light)')
        .matches
        ? ThemeType.light
        : ThemeType.dark;
      if (initialTheme === ThemeType.light) {
        storage.set('theme', initialTheme);
      }
    }
  }

  return (
    <InnerThemeProvider
      initialThemeType={(initialTheme as ThemeType) || ThemeType.dark}
    >
      {children}
    </InnerThemeProvider>
  );
};
