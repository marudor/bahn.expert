// eslint-disable-next-line import/no-unresolved
import { Theme as MaruTheme } from 'maru';
import { Theme as MuiTheme } from '@material-ui/core';
import createMuiTheme from './mui';
import getColors from './colors';

export enum ThemeType {
  black = 'black',
  dark = 'dark',
  light = 'light',
}

export default (themeType: ThemeType): MuiTheme & MaruTheme => {
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
      color: colors.red,
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
