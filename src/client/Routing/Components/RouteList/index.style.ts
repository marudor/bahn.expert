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
    color: theme.palette.text.primary,
    border: `2px solid ${theme.palette.text.primary}`,
    borderRadius: '5px',
    height: '45px',
    backgroundColor: 'transparent',
    margin: '10px',
    flex: 1,
  },
}));
