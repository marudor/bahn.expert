import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  additional: theme.mixins.additional,
  hbf: {
    fontWeight: 'bold',
  },
  cancelled: {
    ...theme.mixins.cancelled,
    ...theme.mixins.changed,
  },
}));
