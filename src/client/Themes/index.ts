import {
  blue,
  green,
  indigo,
  orange,
  red,
  yellow,
} from '@material-ui/core/colors';
// eslint-disable-next-line import/no-unresolved
import { Theme as MaruTheme } from 'maru';
import { Theme as MuiTheme } from '@material-ui/core';
import createMuiTheme from './mui';

export enum ThemeType {
  dark = 'dark',
  light = 'light',
}

function getColors(themeType: ThemeType) {
  switch (themeType) {
    case ThemeType.dark:
      return {
        red: red.A400,
        green: green[400],
        yellow: yellow[400],
        orange: orange[400],
        blue: blue[400],
      };
    case ThemeType.light:
      return {
        red: red[700],
        green: green[800],
        yellow: yellow[600],
        orange: orange[400],
        blue: indigo[800],
      };
  }
}

export default (themeType: ThemeType): MuiTheme & MaruTheme => {
  const mui = createMuiTheme(themeType);

  const colors = getColors(themeType);

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
