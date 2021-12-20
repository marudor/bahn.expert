import {
  blue,
  green,
  indigo,
  lightGreen,
  orange,
  red,
  yellow,
} from '@mui/material/colors';
import { ThemeType } from './type';
import type { Theme } from '@mui/material';

interface Colors {
  red: string;
  green: string;
  yellow: string;
  orange: string;
  blue: string;
  shadedBackground: string;
  transparentBackground: string;
}

export function getColors(theme: Theme, themeType: ThemeType): Colors {
  const backgroundAugment = theme.palette.augmentColor({
    color: {
      main: theme.palette.background.default,
    },
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
