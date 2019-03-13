// @flow
import { red } from 'style/colors';
import type { OwnProps } from './Mid';

export default {
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    whiteSpace: ({ detail }: OwnProps) => (detail ? 'normal' : 'nowrap'),
    overflow: 'hidden',
  },
  cancelled: {
    textDecoration: 'line-through',
  },
  destination: {
    fontSize: '4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: ({ abfahrt }: OwnProps) => (abfahrt.isCancelled ? 'line-through' : undefined),
    color: ({ abfahrt }: OwnProps) =>
      !abfahrt.isCancelled && abfahrt.destination !== abfahrt.scheduledDestination ? red : undefined,
  },
};
