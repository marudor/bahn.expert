// @flow
import { cancelled } from 'style/mixins';
import { green, red } from 'style/colors';
import type { ReduxProps } from './Times';

const delayColor = (delay: number) => {
  if (delay) {
    return delay > 0 ? red : green;
  }
};

export default {
  main: {
    fontSize: '2.4em',
    color: ({ abfahrt, detail }: ReduxProps) => {
      const { scheduledDeparture, delayDeparture, delayArrival } = abfahrt;
      const time = scheduledDeparture ? delayDeparture : delayArrival;

      if (!detail) {
        return delayColor(time);
      }
    },
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > span': {
      color: 'black',
      whiteSpace: 'pre-wrap',
    },
  },
  detailAb: ({ abfahrt }: ReduxProps) => ({
    color: delayColor(abfahrt.delayDeparture),
  }),
  detailAn: ({ abfahrt }: ReduxProps) => ({
    color: delayColor(abfahrt.delayArrival),
  }),
  cancelled,
};
