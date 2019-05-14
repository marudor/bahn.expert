import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
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
