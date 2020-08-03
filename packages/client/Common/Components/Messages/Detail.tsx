import { compareDesc } from 'date-fns';
import { HimIrisMessage } from 'client/Common/Components/Messages/HimIrisMessage';
import { IrisMessage } from 'client/Common/Components/Messages/IrisMessage';
import { useStyles } from './Normal';
import type { Message } from 'types/iris';

interface Props {
  messages: Message[];
}

export const DetailMessages = ({ messages }: Props) => {
  const classes = useStyles();
  const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return (
    <div className={classes.wrap}>
      {sorted.map((m, i) => {
        const MessageComponent = 'head' in m ? HimIrisMessage : IrisMessage;

        return <MessageComponent key={i} message={m as any} />;
      })}
    </div>
  );
};
