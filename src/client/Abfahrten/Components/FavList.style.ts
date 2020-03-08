import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  nonClickable: {
    color: '#67b246',
    border: 'none',
    fontSize: '2rem',
  },
  '& > div': {
    color: '#67b246 !important',
  },
});
