import { cancelled, changed } from 'style/mixins';
import { createStyles } from '@material-ui/core';
import { red } from 'style/colors';
export default createStyles({
  main: {
    fontSize: '2.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  detail: {
    whiteSpace: 'inherit',
  },
  info: {
    color: red,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  additional: changed,
  hbf: {
    fontWeight: 'bold',
  },
  cancelled,
});
