import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  main: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    paddingLeft: '.5em',
    fontSize: '2em',
    paddingRight: '.5em',
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > a': {
      color: theme.palette.text.primary,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));
