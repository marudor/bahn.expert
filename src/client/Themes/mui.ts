import { blue, indigo } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

export default (themeType: 'dark' | 'light') =>
  createMuiTheme({
    palette: {
      type: themeType,
      primary: {
        main: themeType === 'dark' ? indigo[800] : blue[400],
      },
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
