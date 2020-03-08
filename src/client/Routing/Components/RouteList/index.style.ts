import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '.5em',
    },
  },
  button: {
    border: '2px solid #585858',
    borderRadius: '5px',
    height: '45px',
    backgroundColor: 'transparent',
    margin: '10px',
    width: '97%',
  },
});
