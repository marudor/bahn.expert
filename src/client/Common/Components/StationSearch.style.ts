import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  geo: {
    position: 'absolute',
    right: 0,
    cursor: 'pointer',
    fontSize: '1.3em',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  paper: {
    background: theme.palette.background.default,
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  loading: {
    position: 'absolute',
    top: '-1em',
    right: '.5em',
    transform: 'scale(.5)',
  },
}));
