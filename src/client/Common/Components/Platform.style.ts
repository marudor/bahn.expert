import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  cancelled: theme.mixins.cancelled,
  delayed: theme.mixins.delayed,
}));
