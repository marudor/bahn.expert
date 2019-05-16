import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  additional: theme.mixins.changed,
  hbf: {
    fontWeight: 'bold',
  },
  cancelled: theme.mixins.cancelled,
}));
