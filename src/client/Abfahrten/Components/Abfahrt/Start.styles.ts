import { createStyles } from '@material-ui/styles';
import { red } from 'style/colors';

export default createStyles({
  main: {
    flex: 1,
    fontSize: '3em',
    maxWidth: '5em',
    display: 'flex',
    flexDirection: 'column',
  },
  cancelled: {
    color: red,
    textDecoration: 'none',
  },
});
