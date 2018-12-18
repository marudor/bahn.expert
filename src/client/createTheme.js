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
    },
    type: 'dark',
    typography: {
      useNextVariants: true,
    },
  });
