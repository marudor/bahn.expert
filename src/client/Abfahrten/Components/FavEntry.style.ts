import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  main: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    paddingLeft: '.5em',
    fontSize: '1.6em',
    paddingRight: '.5em',
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    '& > a': {
      colors: theme.palette.text.primary,
    },
  },
  clickable: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    justifyContent: 'space-between',
  },
  nonClickable: {
    textAlign: 'center',
    fontWeight: 600,
    justifyContent: 'center',
  },
}));
