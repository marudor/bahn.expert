import { blue, indigo } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { Shape } from '@material-ui/core/styles/shape';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { ThemeType } from '.';
import deepMerge from 'deepmerge';

declare module '@material-ui/core/styles/shape' {
  export interface Shape {
    headerSpacing: number;
  }
}

const getPaletteType = (themeType: ThemeType) => {
  switch (themeType) {
    case ThemeType.black:
    case ThemeType.dark:
      return 'dark';
    case ThemeType.light:
      return 'light';
  }
};

const headerSpacing = 54;
const getMuiOptions = (themeType: ThemeType) => {
  const commonOptions: ThemeOptions = {
    palette: {
      type: getPaletteType(themeType),
    },
    shape: {
      headerSpacing,
    },
    overrides: {
      MuiToolbar: {
        regular: {
          minHeight: `${headerSpacing}px!important`,
        },
      },
      MuiPaper: {
        elevation1: {
          backgroundColor: 'inherit',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
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
            main: indigo[800],
          },
        },
        overrides: {
          MuiPaper: {
            elevation1: {
              boxShadow: '0 1px 0 rgba(120, 120, 120, 0.5)',
            },
          },
        },
      });
    case ThemeType.dark:
      return deepMerge(commonOptions, {
        palette: {
          primary: {
            main: indigo[800],
          },
        },
      });
    case ThemeType.light:
      return deepMerge(commonOptions, {
        palette: {
          primary: {
            main: blue[400],
          },
        },
      });
  }
};

export default (themeType: ThemeType) =>
  createMuiTheme(getMuiOptions(themeType));
