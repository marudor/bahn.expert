import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  main: {
    fontSize: '2.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '& a': {
      color: theme.palette.text.primary,
    },
  },
  detail: {
    whiteSpace: 'inherit',
  },
  info: {
    color: theme.colors.red,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  additional: theme.mixins.changed,
  hbf: {
    fontWeight: 'bold',
  },
  cancelled: theme.mixins.cancelled,
}));
