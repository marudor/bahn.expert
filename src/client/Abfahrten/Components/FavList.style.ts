import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  main: {
    marginTop: theme.shape.headerSpacing,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
}));
