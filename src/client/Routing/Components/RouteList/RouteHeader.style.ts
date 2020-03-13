import { gridStyle } from './Route.style';
import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    fontSize: '0.7em',
    ...gridStyle,
  },
  date: {
    gridArea: '1 / 1 / 2 / 5',
    fontSize: '1.5em',
    textAlign: 'center',
    marginBottom: '10px',
  },
});
