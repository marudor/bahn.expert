import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  link: {
    color: theme.colors.blue,
    position: 'absolute',
    bottom: '.5em',
    left: 0,
    cursor: 'pointer',
  },
  dialog: {
    width: '95%',
    margin: 0,
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    '&>svg': {
      marginRight: '1em',
    },
  },
  comfort: {
    width: '1em',
    height: '1em',
    fontSize: '1.5rem',
    backgroundColor: theme.colors.red,
    borderRadius: '50%',
  },
}));
