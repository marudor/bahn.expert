import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  main: {
    flex: 1,
    fontSize: '3em',
    maxWidth: '5em',
    display: 'flex',
    flexDirection: 'column',
  },
  cancelled: {
    color: theme.colors.red,
    textDecoration: 'none',
  },
  links: {
    fontSize: '.6em',
    display: 'flex',
    flexDirection: 'column',
  },
}));
