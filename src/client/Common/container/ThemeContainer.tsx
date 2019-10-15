import { createContainer } from 'unstated-next';
import { setCookieOptions } from 'client/util';
import { ThemeType } from 'client/Themes/type';
import Cookies from 'universal-cookie';
import createTheme from 'client/Themes';
import React, { ReactNode, useMemo, useState } from 'react';
import useCookies from 'Common/useCookies';
import useQuery from 'Common/hooks/useQuery';

function setTheme(
  setFn: ((themeType: ThemeType) => void) | undefined,
  cookies: Cookies,
  themeType: ThemeType
) {
  if (setFn) {
    setFn(themeType);
  }
  cookies.set('theme', themeType, setCookieOptions);
}

function useTheme(initialThemeType: ThemeType = ThemeType.light) {
  const [themeType, setThemeType] = useState(initialThemeType);
  const cookies = useCookies();
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  return {
    themeType,
    setTheme: setTheme.bind(undefined, setThemeType, cookies),
    theme,
  };
}

const ThemeContainer = createContainer(useTheme);

export default ThemeContainer;

type Props = {
  children: ReactNode;
};
export const ThemeProvider = ({ children }: Props) => {
  const cookies = useCookies();
  let initialTheme;
  const query = useQuery();

  initialTheme = query.theme;

  if (!initialTheme) {
    // @ts-ignore 7053
    initialTheme = ThemeType[cookies.get('theme')];
    if (!initialTheme && !global.SERVER) {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeType.dark
        : ThemeType.light;
      setTheme(undefined, cookies, initialTheme);
    }
  }

  return (
    <ThemeContainer.Provider initialState={initialTheme}>
      {children}
    </ThemeContainer.Provider>
  );
};
