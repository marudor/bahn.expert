import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  '@global': {
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
