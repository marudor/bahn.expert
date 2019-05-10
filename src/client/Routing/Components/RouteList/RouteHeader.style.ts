import { gridStyle } from './Route.style';
import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>({
  main: {
    fontSize: '0.7em',
    ...gridStyle,
  },
});
