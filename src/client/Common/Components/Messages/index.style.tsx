import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  messages: {
    color: theme.colors.red,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cancelled: theme.mixins.cancelled,
  him: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));
