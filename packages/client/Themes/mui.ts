import { blue, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material';
import { ThemeType } from './type';
import deepMerge from 'deepmerge';
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

const getMuiOptions = (themeType: ThemeType) => {
  const commonOptions: ThemeOptions = {
    palette: {
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
    },
  };

  switch (themeType) {
    case ThemeType.black:
      return deepMerge(commonOptions, {
        palette: {
          background: {
            default: '#000000',
          },
          primary: {
            main: blue[800],
          },
        },
        overrides: {
          MuiPaper: {
            styleOverrides: {
              elevation1: {
                boxShadow: '0 1px 0 rgba(120, 120, 120, 0.5)',
              },
            },
          },
        },
      });
    case ThemeType.dark:
      return deepMerge(commonOptions, {
        palette: {
          background: {
            default: '#303030',
          },
          primary: {
            main: blue[700],
          },
          secondary: {
            main: purple.A400,
          },
        },
      });
    case ThemeType.light:
      return deepMerge(commonOptions, {
        palette: {
          primary: {
            main: blue[400],
          },
          background: {
            default: '#fafafa',
          },
        },
      });
  }
};

export const createMuiTheme = (themeType: ThemeType): Theme =>
  createTheme(getMuiOptions(themeType));
