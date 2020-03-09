import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
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
    color: theme.palette.text.primary,
    flex: 1,
  },
}));
