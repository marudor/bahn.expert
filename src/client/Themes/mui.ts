import { blue, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { ThemeType } from './type';
import type { Theme as MuiTheme, ThemeOptions } from '@mui/material';

const getPaletteType = (themeType: E<typeof ThemeType>) => {
  switch (themeType) {
    case ThemeType.black:
    case ThemeType.dark: {
      return 'dark';
    }
    case ThemeType.light: {
      return 'light';
    }
  }
};

// unit: em
const headerSpacing = 3.3;

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

const getMuiOptions = (themeType: E<typeof ThemeType>): ThemeOptions => {
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
            height: `${headerSpacing}em!important`,
            minHeight: `${headerSpacing}em!important`,
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

export const createMuiTheme = (themeType: E<typeof ThemeType>): MuiTheme =>
  createTheme(getMuiOptions(themeType));
