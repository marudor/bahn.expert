import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  toolbar: {
    paddingLeft: '.3em',
    '& > *': {
      flexShrink: 0,
    },
  },
  destination: {
    flex: 1,
    display: 'flex',
    marginLeft: '1em',
    justifyContent: 'space-evenly',
  },
  train: {
    display: 'flex',
    flexDirection: 'column',
  },
});
