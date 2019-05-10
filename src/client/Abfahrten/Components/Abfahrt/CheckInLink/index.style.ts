import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  link: {
    fontSize: '0.6em',
    color: theme.colors.blue,
  },
}));
