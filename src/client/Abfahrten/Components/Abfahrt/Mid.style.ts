import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  detail: {
    whiteSpace: 'normal!important' as 'normal',
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    height: '100%',
    maxHeight: '50px',
    transition: 'max-height 350ms ease-in-out',
    '&.expanded': {
      maxHeight: '100em',
    },
  },
  cancelled: {
    textDecoration: 'line-through',
  },
  destination: {
    fontSize: '4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  different: {
    color: theme.colors.red,
  },
}));
