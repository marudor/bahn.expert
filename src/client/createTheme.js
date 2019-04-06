// @flow
import { createMuiTheme } from '@material-ui/core/styles';

export default () =>
  createMuiTheme({
    overrides: {
      MuiFormControlLabel: {
        root: {
          marginLeft: 0,
          justifyContent: 'space-between',
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
        },
      },
    },
    type: 'dark',
    typography: {
      useNextVariants: true,
    },
  });
