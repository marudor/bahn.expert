import { Message } from 'types/iris';
import cc from 'clsx';
import React, { useMemo } from 'react';
import useStyles from './index.style';

interface Props {
  messages: Message[];
  cancelled: boolean;
}
const NormalMessages = ({ messages, cancelled }: Props) => {
  const classes = useStyles();
  const messagesDisplay = useMemo(
    () => messages.map(m => m.text).join(' +++ '),
    [messages]
  );

  return (
    <div className={cc(classes.messages, { [classes.cancelled]: cancelled })}>
      {messagesDisplay}
    </div>
  );
};

export default NormalMessages;
