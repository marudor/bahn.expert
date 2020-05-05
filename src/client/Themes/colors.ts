import {
  blue,
  green,
  indigo,
  lightGreen,
  orange,
  red,
  yellow,
} from '@material-ui/core/colors';
import { ThemeType } from './type';
import type { Theme as MuiTheme } from '@material-ui/core';

export default function getColors(theme: MuiTheme, themeType: ThemeType) {
  const backgroundAugment = theme.palette.augmentColor({
    main: theme.palette.background.default,
  });

  switch (themeType) {
    case ThemeType.black:
      return {
        red: red.A400,
        green: lightGreen[600],
        yellow: yellow[400],
        orange: orange[400],
        blue: blue[400],
        shadedBackground: backgroundAugment.light,
        transparentBackground: 'rgba(0, 0, 0, 0.55)',
      };
    case ThemeType.dark:
      return {
        red: red.A400,
        green: lightGreen[600],
        yellow: yellow[400],
        orange: orange[400],
        blue: blue[400],
        shadedBackground: backgroundAugment.light,
        transparentBackground: 'rgba(48, 48, 48, 0.55)',
      };
    case ThemeType.light:
      return {
        red: red[700],
        green: green[800],
        yellow: yellow[600],
        orange: orange[400],
        blue: indigo[800],
        shadedBackground: backgroundAugment.dark,
        transparentBackground: 'rgba(255, 255, 255, 0.55)',
      };
  }
}
