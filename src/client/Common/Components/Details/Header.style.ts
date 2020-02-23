import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { makeStyles } from '@material-ui/styles';

const singleLine: CSSProperties = {
  overflow: 'hidden',
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default makeStyles({
  product: {
    gridArea: 'p',
    ...singleLine,
  },
  date: {
    gridArea: 'd',
    ...singleLine,
  },
  arrow: {
    gridArea: 'a',
    minWidth: '1.5em',
  },
  operator: {
    gridArea: 'o',
    ...singleLine,
  },
  destination: {
    gridArea: 'g',
  },
  wrap: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr min-content 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridTemplateAreas: '"p a g" "o a g" "d a g"',
    alignItems: 'center',
    justifyItems: 'center',
  },
});
