// @flow
import { cancelled, delayed, early } from 'style/mixins';

export default {
  early,
  delayed,
  time: {
    display: 'flex',
    flexDirection: 'column',
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
};
