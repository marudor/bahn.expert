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
  pride: string;
}

export function getColors(
  theme: Theme,
  themeType: E<typeof ThemeType>,
): Colors {
  const backgroundAugment = theme.palette.augmentColor({
    color: {
      main: theme.palette.background.default,
    },
  });

  const pride =
    'linear-gradient(180deg, #FE0000 16.66%,#FD8C00 16.66%, 33.32%,#FFE500 33.32%, 49.98%,#119F0B 49.98%, 66.64%,#0644B3 66.64%, 83.3%,#C22EDC 83.3%);';

  switch (themeType) {
    case ThemeType.black:
      return {
        pride,
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
        pride,
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
        pride,
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
