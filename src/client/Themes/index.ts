/* eslint-disable @typescript-eslint/ban-types */
import { createMuiTheme } from './mui';
import { css } from '@mui/material';
import { getColors } from './colors';
import type { Theme as MaruTheme } from 'maru';
import type { Theme as MuiTheme } from '@mui/material';
import type { ThemeType } from './type';

type MaruMixins = MaruTheme['mixins'];

declare module '@mui/system' {
  interface Shape {
    headerSpacing: number;
  }
}
declare module '@mui/material/styles/createMixins' {
  interface Mixins extends MaruMixins {}
}

declare module '@mui/material/styles/createTheme' {
  interface Theme extends MaruTheme {}
}

declare module '@emotion/react' {
  interface Theme extends MuiTheme {}
}

export const createTheme = (themeType: E<typeof ThemeType>): MuiTheme => {
  const mui = createMuiTheme(themeType);

  const colors = getColors(mui, themeType);

  const mixins: MaruMixins = {
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
    singleLineText: {
      overflow: 'hidden',
      maxWidth: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    stripe: {
      position: 'absolute',
      top: '-1.4em',
      height: '1.3em',
      left: -1,
      right: -1,
      opacity: 0.8,
    },
  };

  const reducedMixins: Record<string, ReturnType<typeof css>> = {};

  for (const mixinKey of Object.keys(mixins)) {
    reducedMixins[mixinKey] = css(mixins[mixinKey as keyof typeof mixins]);
  }

  const maruTheme = {
    colors,
    mixins: {
      ...mui.mixins,
      ...reducedMixins,
    },
  };

  return {
    ...mui,
    ...maruTheme,
  };
};
