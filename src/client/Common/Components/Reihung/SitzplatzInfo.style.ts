import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  link: {
    color: theme.colors.blue,
    cursor: 'pointer',
  },
  textLine: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
