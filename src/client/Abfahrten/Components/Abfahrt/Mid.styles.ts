import { createStyles } from '@material-ui/styles';
import { red } from 'style/colors';

export default createStyles({
  detail: {
    whiteSpace: 'normal!important' as 'normal',
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
    color: red,
  },
});
