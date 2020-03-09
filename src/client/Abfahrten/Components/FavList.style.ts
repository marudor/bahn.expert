import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  nonClickable: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});
