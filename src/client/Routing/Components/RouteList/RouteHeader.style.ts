import { gridStyle } from './Route.style';
import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    fontSize: '0.8em',
    ...gridStyle,
  },
  date: {
    gridArea: '1 / 1 / 2 / 5',
    textAlign: 'center',
    marginBottom: '10px',
  },
  chip: {
    fontSize: '1.4rem',
  },
});
