import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  main: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    paddingLeft: '.5em',
    fontSize: '1.6em',
    paddingRight: '.5em',
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    height: '60px',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    '& > a': {
      colors: theme.palette.text.primary,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));
