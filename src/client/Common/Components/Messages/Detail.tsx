import { compareDesc, format } from 'date-fns';
import { Message } from 'types/iris';
import cc from 'clsx';
import React from 'react';
import useStyles from './index.style';

interface Props {
  messages: Message[];
}

const DetailMessages = ({ messages }: Props) => {
  const today = new Date().getDate();
  const classes = useStyles();
  const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return (
    <div className={classes.messages}>
      {sorted.map((m, i) => {
        const ts = new Date(m.timestamp);

        return (
          <div
            key={i}
            className={cc({
              [classes.cancelled]: m.superseded,
            })}
          >
            {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
            {m.text}
          </div>
        );
      })}
    </div>
  );
};

export default DetailMessages;
