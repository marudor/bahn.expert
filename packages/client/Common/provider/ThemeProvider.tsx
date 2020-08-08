import { createTheme } from 'client/Themes';
import { PropsWithChildren, useMemo, useState } from 'react';
import { ThemeType } from 'client/Themes/type';
import { useQuery } from 'client/Common/hooks/useQuery';
import { useWebStorage } from 'client/useWebStorage';
import constate from 'constate';

function useThemeInner({ initialThemeType }: { initialThemeType: ThemeType }) {
  const [themeType, setThemeType] = useState(initialThemeType);
  const storage = useWebStorage();
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

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const storage = useWebStorage();
  const query = useQuery();
  let initialTheme = query.theme;
  if (!initialTheme) {
    // @ts-expect-error
    initialTheme = ThemeType[storage.get('theme')];
    if (!initialTheme && !global.SERVER) {
      initialTheme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? ThemeType.light
        : ThemeType.dark;
      storage.set('theme', initialTheme);
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
