import { createTheme } from 'client/Themes';
import { ThemeType } from 'client/Themes/type';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'client/Common/hooks/useQuery';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { FC } from 'react';

function useThemeInner({
  initialThemeType,
}: {
  initialThemeType?: E<typeof ThemeType>;
}) {
  const [themeType, setThemeType] = useState(
    initialThemeType || ThemeType.dark,
  );
  const storage = useStorage();
  useEffect(() => {
    if (!initialThemeType) {
      const prefferedTheme = globalThis.matchMedia?.(
        '(prefers-color-scheme: light)',
      ).matches
        ? ThemeType.light
        : ThemeType.dark;
      if (prefferedTheme === ThemeType.light) {
        storage.set('theme', prefferedTheme);
      }
      setThemeType(prefferedTheme);
    }
  }, []);
  const theme = useMemo(() => createTheme(themeType), [themeType]);
  return {
    themeType,
    theme,
    setThemeType: (newThemeType: E<typeof ThemeType>) => {
      setThemeType(newThemeType);
      storage.set('theme', newThemeType);
    },
  };
}

export const [InnerThemeProvider, useTheme] = constate(useThemeInner);

export const ThemeProvider: FC = ({ children }) => {
  const storage = useStorage();
  const query = useQuery();

  // @ts-expect-error works
  let initialTheme: ThemeType = query.theme;
  if (!initialTheme) {
    // @ts-expect-error works
    initialTheme = ThemeType[storage.get('theme')];
    // if (!initialTheme) {
    //   initialTheme = globalThis.matchMedia?.('(prefers-color-scheme: light)')
    //     .matches
    //     ? ThemeType.light
    //     : ThemeType.dark;
    //   if (initialTheme === ThemeType.light) {
    //     storage.set('theme', initialTheme);
    //   }
    // }
  }

  return (
    <InnerThemeProvider initialThemeType={initialTheme}>
      {children}
    </InnerThemeProvider>
  );
};
