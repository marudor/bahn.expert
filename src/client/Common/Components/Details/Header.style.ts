import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  product: {
    gridArea: 'p',
  },
  date: {
    gridArea: 'd',
  },
  arrow: {
    gridArea: 'a',
    minWidth: '1.5em',
  },
  destination: {
    gridArea: 'g',
  },
  wrap: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr min-content 1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"p a g" "d a g"',
    alignItems: 'center',
    justifyItems: 'center',
  },
});
