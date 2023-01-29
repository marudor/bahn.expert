import { HimIrisMessage } from '@/client/Common/Components/Messages/HimIrisMessage';
import { IrisMessage } from '@/client/Common/Components/Messages/IrisMessage';
import { MessageContainer } from './Normal';
import type { FC } from 'react';
import type { Message } from '@/types/iris';

interface Props {
  messages: Message[];
}

export const DetailMessages: FC<Props> = ({ messages }) => {
  return (
    <MessageContainer>
      {messages.map((m, i) => {
        const MessageComponent = 'head' in m ? HimIrisMessage : IrisMessage;

        return <MessageComponent key={i} message={m as any} />;
      })}
    </MessageContainer>
  );
};
