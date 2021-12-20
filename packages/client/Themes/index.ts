import { createMuiTheme } from './mui';
import { getColors } from './colors';
// eslint-disable-next-line import/no-unresolved
import { css } from '@mui/material';
import type { Theme as MaruTheme } from 'maru';
import type { Theme as MuiTheme } from '@mui/material';
import type { ThemeType } from './type';

type MaruMixins = MaruTheme['mixins'];
declare module '@mui/material/styles/createTheme' {
  interface Theme extends MaruTheme {}
}

declare module '@emotion/react' {
  interface Theme extends MuiTheme {}
}

export const createTheme = (themeType: ThemeType): MuiTheme => {
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
  };

  const maruTheme = {
    colors,
    mixins: {
      ...mui.mixins,
      ...Object.keys(mixins).reduce((m, mixinKey) => {
        // @ts-expect-error workaround for now
        m[mixinKey] = css(mixins[mixinKey]);
        return m;
      }, {}),
    },
  };

  return {
    ...mui,
    ...maruTheme,
  };
};
