import { createTheme as createMuiTheme } from './mui';
import { getColors } from './colors';
// eslint-disable-next-line import/no-unresolved
import type { Theme as MaruTheme } from 'maru';
import type { Theme as MuiTheme } from '@material-ui/core';
import type { ThemeType } from './type';

declare module 'styled-components' {
  interface DefaultTheme extends MaruTheme, MuiTheme {}
}

export const createTheme = (themeType: ThemeType): MuiTheme & MaruTheme => {
  const mui = createMuiTheme(themeType);

  const colors = getColors(mui, themeType);

  const mixins = {
    cancelled: {
      textDecoration: 'line-through',
      textDecorationColor: mui.palette.text.primary,
    },
    delayed: {
      color: colors.red,
    },
    changed: {
      color: `${colors.red}!important`,
    },
    additional: {
      color: `${colors.green}!important`,
    },
    early: {
      color: colors.green,
    },
    ...mui.mixins,
  };

  const maruTheme = {
    colors,
    mixins,
  };

  return {
    ...mui,
    ...maruTheme,
  };
};
