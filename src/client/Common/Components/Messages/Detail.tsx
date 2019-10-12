import { compareDesc, format } from 'date-fns';
import { Message } from 'types/api/iris';
import cc from 'clsx';
import React from 'react';
import useStyles from './index.style';

interface Props {
  messages: Message[];
  isCancelled?: boolean;
}

const DetailMessages = ({ messages, isCancelled }: Props) => {
  const today = new Date().getDate();
  const classes = useStyles();
  const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return (
    <div
      className={cc(classes.messages, {
        [classes.cancelled]: isCancelled,
      })}
    >
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
