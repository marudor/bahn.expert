import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  '@global': {
    '.rmc-pull-to-refresh-indicator': {
      position: 'absolute',
      top: '-1.5em',
      textAlign: 'center',
      left: 0,
      right: 0,
    },
    'html, body': {
      height: '100%',
    },
    '#app': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    body: {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    a: {
      textDecoration: 'none',
      color: theme.colors.blue,
    },
    main: {
      marginTop: theme.shape.headerSpacing,
    },
  },
}));
