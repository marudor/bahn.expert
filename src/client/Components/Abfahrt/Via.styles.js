// @flow
import { cancelled, changed } from 'style/mixins';
import { red } from 'style/colors';
import type { ReduxProps } from './Via';
export default {
  main: {
    fontSize: '2.1em',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: ({ detail }: ReduxProps) => (detail ? 'inherit' : 'nowrap'),
    '& a': {
      color: 'inherit',
    },
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
};
