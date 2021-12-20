import { blue, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material';
import { ThemeType } from './type';
import type { Mixins as MaruMixins } from 'maru';
import type { Theme, ThemeOptions } from '@mui/material';

const getPaletteType = (themeType: ThemeType) => {
  switch (themeType) {
    case ThemeType.black:
    case ThemeType.dark:
      return 'dark';
    case ThemeType.light:
      return 'light';
  }
};

declare module '@mui/system/createTheme/shape' {
  export interface Shape {
    headerSpacing: number;
  }
}

declare module '@mui/material/styles/createMixins' {
  export interface Mixins extends MaruMixins {}
}

const headerSpacing = 54;

const primaryColor = {
  [ThemeType.dark]: blue[700],
  [ThemeType.black]: blue[800],
  [ThemeType.light]: blue[400],
};

const backgroundColor = {
  [ThemeType.dark]: '#303030',
  [ThemeType.black]: '#000000',
  [ThemeType.light]: '#fafafa',
};

const secondaryColor = {
  [ThemeType.dark]: purple.A400,
  [ThemeType.black]: purple.A400,
  [ThemeType.light]: purple[400],
};

const overrides = {
  [ThemeType.black]: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          backgroundColor: 'inherit',
          backgroundImage: 'unset',
          boxShadow: '0 1px 0 rgba(120, 120, 120, 0.5)',
        },
      },
    },
  },
};

const getMuiOptions = (themeType: ThemeType): ThemeOptions => {
  return {
    palette: {
      background: {
        default: backgroundColor[themeType],
      },
      primary: {
        main: primaryColor[themeType],
      },
      secondary: {
        main: secondaryColor[themeType],
      },
      mode: getPaletteType(themeType),
    },
    shape: {
      headerSpacing,
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
        },
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: `${headerSpacing}px!important`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'unset',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation1: {
            backgroundColor: 'inherit',
            backgroundImage: 'unset',
            boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
          },
        },
      },
      // @ts-expect-error undefined works if index doesnt exist
      ...overrides[themeType],
    },
  };
};

export const createMuiTheme = (themeType: ThemeType): Theme =>
  createTheme(getMuiOptions(themeType));
