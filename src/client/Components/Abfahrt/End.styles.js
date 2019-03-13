// @flow
import { cancelled, delayed, early } from 'style/mixins';
export default {
  main: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '1em',
  },
  delay: {
    fontSize: '3em',
    marginRight: '.4em',
  },
  platform: {
    fontSize: '3em',
  },
  bottom: {
    lineHeight: 1.3,
  },
  delayed,
  early,
  cancelled,
};
