import { createMuiTheme } from '@material-ui/core/styles';

export default (themeType: 'dark' | 'light') =>
  createMuiTheme({
    palette: {
      type: themeType,
      // background: {
      //   default: '#202020',
      // },
    },
    overrides: {
      MuiFormControlLabel: {
        root: {
          marginLeft: 0,
          justifyContent: 'space-between',
        },
      },
      MuiPaper: {
        elevation1: {
          backgroundColor: 'inherit',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
        },
      },
    },
  });
