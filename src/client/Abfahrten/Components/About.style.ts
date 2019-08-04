import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  buttons: {
    '& svg': {
      marginRight: 5,
    },
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1em',
    '@media screen and (max-width: 1200px)': {
      flexDirection: 'column',
      alignItems: 'center',
      height: '10em',
    },
  },
  main: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.shape.headerSpacing + 10,
  },
  privacy: {
    marginTop: '5em',
  },
}));
