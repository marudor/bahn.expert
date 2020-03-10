import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  wrapper: {
    flex: 1,
    position: 'relative',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: '10px',
    '& > div:nth-child(1)': {
      width: '100%',
    },
    '& input': {
      height: '2.3rem',
      fontSize: '1.4rem',
      '&::placeholder': {
        fontSize: '1.1rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
      },
    },
  },
  icons: {
    '& > svg': {
      fontSize: '1.3em',
      verticalAlign: 'middle',
    },
    position: 'absolute',
    right: 0,
    cursor: 'pointer',
    top: '50%',
    transform: 'translateY(-50%)',
    margin: '0 10px',
  },
  paper: {
    background: theme.palette.background.default,
    position: 'absolute',
    zIndex: 2,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  loading: {
    position: 'absolute',
    top: '0.4em',
    right: '2em',
    transform: 'scale(.5)',
  },
  searchInput: {
    '& input': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '92%',
    },
  },
}));
