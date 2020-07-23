import { compareDesc } from 'date-fns';
import { MessagesWrap } from 'client/Common/Components/Messages/Normal';
import HimIrisMessage from 'client/Common/Components/Messages/HimIrisMessage';
import IrisMessage from 'client/Common/Components/Messages/IrisMessage';
import type { Message } from 'types/iris';

interface Props {
  messages: Message[];
}

const DetailMessages = ({ messages }: Props) => {
  const sorted = messages.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return (
    <MessagesWrap>
      {sorted.map((m, i) => {
        const MessageComponent = 'head' in m ? HimIrisMessage : IrisMessage;

        return <MessageComponent key={i} message={m as any} />;
      })}
    </MessagesWrap>
  );
};

export default DetailMessages;
