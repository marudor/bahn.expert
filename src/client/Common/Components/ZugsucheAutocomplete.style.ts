import { makeStyles } from '@material-ui/styles';
export default makeStyles({
  wrapper: {
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: '-1em',
    right: '-1em',
    transform: 'scale(.5)',
  },
});
