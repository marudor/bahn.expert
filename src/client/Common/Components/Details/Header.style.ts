import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    paddingLeft: '.3em',
    '& > *': {
      flexShrink: 0,
    },
    '@media screen and (min-width: 700px)': {
      width: '40em',
      margin: 'auto',
    },
  },
  train: {
    flex: 1,
    display: 'flex',
    marginLeft: '1em',
    justifyContent: 'space-evenly',
  },
});
