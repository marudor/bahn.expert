import { gridStyle } from './Route.style';
import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    fontSize: '0.8em',
    ...gridStyle,
  },
  date: {
    gridArea: '1 / 1 / 2 / 5',
    fontSize: '1.7em',
    textAlign: 'center',
  },
});
