import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  cancelled: theme.mixins.cancelled,
  changed: theme.mixins.changed,
  changedWrapper: {
    paddingLeft: '.3em',
  },
}));
