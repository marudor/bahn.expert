// @flow
import { cancelled, delayed, early } from 'style/mixins';

export default {
  main: {
    fontSize: '2.4em',
  },
  early,
  delayed,
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
