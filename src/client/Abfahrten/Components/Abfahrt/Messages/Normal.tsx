import { Message } from 'types/abfahrten';
import cc from 'classnames';
import React, { useMemo } from 'react';
import useStyles from './index.style';

interface Props {
  messages: Message[];
  isCancelled: boolean;
}
const NormalMessages = ({ messages, isCancelled }: Props) => {
  const classes = useStyles();
  const messagesDisplay = useMemo(
    () => messages.map(m => m.text).join(' +++ '),
    [messages]
  );

  return (
    <div className={cc(classes.messages, { [classes.cancelled]: isCancelled })}>
      {messagesDisplay}
    </div>
  );
};

export default NormalMessages;
