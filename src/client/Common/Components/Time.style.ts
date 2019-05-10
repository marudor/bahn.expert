import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  cancelled: theme.mixins.cancelled,
  alignEnd: {
    alignItems: 'flex-end',
  },
  time: {
    display: 'flex',
  },
  seperateLine: {
    flexDirection: 'column',
  },
  spacing: {
    marginRight: '.2em',
  },
  delayed: theme.mixins.delayed,
  early: theme.mixins.early,
}));
