// @flow
import { red } from 'style/colors';

export default {
  detail: {
    whiteSpace: 'normal !important',
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  cancelled: {
    textDecoration: 'line-through',
  },
  destination: {
    fontSize: '4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  different: {
    color: red,
  },
};
