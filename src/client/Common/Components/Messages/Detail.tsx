import { compareDesc } from 'date-fns';
import { HimIrisMessage } from 'client/Common/Components/Messages/HimIrisMessage';
import { IrisMessage } from 'client/Common/Components/Messages/IrisMessage';
import { MessageContainer } from './Normal';
import type { FC } from 'react';
import type { Message } from 'types/iris';

interface Props {
  messages: Message[];
}

export const DetailMessages: FC<Props> = ({ messages }) => {
  const sorted = messages.sort((a, b) =>
    compareDesc(a.timestamp || 0, b.timestamp || 0),
  );

  return (
    <MessageContainer>
      {sorted.map((m, i) => {
        const MessageComponent = 'head' in m ? HimIrisMessage : IrisMessage;

        return <MessageComponent key={i} message={m as any} />;
      })}
    </MessageContainer>
  );
};
