import { createTheme } from '@/client/Themes';
import { ThemeType } from '@/client/Themes/type';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@/client/Common/hooks/useQuery';
import { useStorage } from '@/client/useStorage';
import constate from 'constate';
import type { FC, PropsWithChildren } from 'react';

function useThemeInner({
  initialThemeType,
}: PropsWithChildren<{
  initialThemeType?: E<typeof ThemeType>;
}>) {
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
    // eslint-disable-next-line
  }, []);
  const theme = useMemo(() => {
    globalThis.RENDERED_THEME = themeType;
    return createTheme(themeType);
  }, [themeType]);
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

export const ThemeProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const storage = useStorage();
  const query = useQuery();

  // @ts-expect-error works
  let initialTheme: ThemeType = query.theme;
  if (!initialTheme) {
    // @ts-expect-error works
    initialTheme = ThemeType[storage.get('theme')];
    // Workaround if cookies failed to be send
    if (
      // @ts-expect-error not typed
      globalThis.SERVER_RENDERED_THEME &&
      // @ts-expect-error not typed
      globalThis.SERVER_RENDERED_THEME !== initialTheme
    ) {
      // @ts-expect-error not typed
      initialTheme = globalThis.SERVER_RENDERED_THEME;
    }
  }

  return (
    <InnerThemeProvider initialThemeType={initialTheme}>
      {children}
    </InnerThemeProvider>
  );
};
