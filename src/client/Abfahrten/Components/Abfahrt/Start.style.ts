import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  main: {
    flex: 1,
    fontSize: '3em',
    maxWidth: '5em',
    display: 'flex',
    flexDirection: 'column',
  },
  cancelled: {
    color: theme.colors.red,
    textDecoration: 'none',
  },
}));
