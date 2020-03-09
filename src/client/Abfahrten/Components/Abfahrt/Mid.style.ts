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
