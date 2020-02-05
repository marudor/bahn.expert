import { format } from 'date-fns';
import { IrisMessage as IrisMessageType } from 'types/iris';
import cc from 'clsx';
import React from 'react';
import useStyles from './index.style';

interface Props {
  message: IrisMessageType;
  today?: number;
}

const IrisMessage = ({ message, today = new Date().getDate() }: Props) => {
  const classes = useStyles();
  const ts = new Date(message.timestamp);

  return (
    <div
      className={cc({
        [classes.cancelled]: message.superseded,
      })}
    >
      {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
      {message.text}
    </div>
  );
};

export default IrisMessage;
