import { cancelled } from 'style/mixins';
import { createStyles } from '@material-ui/styles';

export default createStyles({
  time: {
    alignItems: 'flex-end',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > span': {
      color: 'black',
      whiteSpace: 'pre-wrap',
    },
  },
  cancelled,
});
