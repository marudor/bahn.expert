import { makeStyles } from '@material-ui/styles';
import { singleLineText } from 'client/util/cssUtils';

export default makeStyles({
  product: {
    gridArea: 'p',
    ...singleLineText,
  },
  date: {
    gridArea: 'd',
    ...singleLineText,
  },
  arrow: {
    gridArea: 'a',
    minWidth: '1.5em',
  },
  operator: {
    gridArea: 'o',
    ...singleLineText,
  },
  destination: {
    gridArea: 'g',
  },
  wrap: {
    fontSize: '90%',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr min-content 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridTemplateAreas: '"p a g" "o a g" "d a g"',
    alignItems: 'center',
    justifyItems: 'center',
  },
});
