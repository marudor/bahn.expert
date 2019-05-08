import { createMuiTheme } from '@material-ui/core/styles';
import theme from './index';

export default createMuiTheme({
  palette: {
    type: theme.mui.type,
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
