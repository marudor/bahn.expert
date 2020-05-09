import { blue } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeType } from './type';
import deepMerge from 'deepmerge';
import type { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import type { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends MuiPickersOverrides {}
}

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
      MuiPickersModal: {
        withAdditionalAction: {
          color: 'red',
        },
      },
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
            main: blue[800],
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
            main: blue[700],
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
