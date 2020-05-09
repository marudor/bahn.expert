import { makeStyles } from '@material-ui/core';
import { singleLineText } from 'client/util/cssUtils';

export default makeStyles({
  wrap: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"s f" "d f"',
    alignItems: 'center',
  },
  start: {
    gridArea: 's',
    ...singleLineText,
  },
  destination: {
    gridArea: 'd',
    ...singleLineText,
  },
  fav: {
    gridArea: 'f',
  },
});
