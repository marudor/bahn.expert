import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '.5em',
    },
  },
  button: {
    height: '45px',
    margin: '10px',
    flex: 1,
  },
});
