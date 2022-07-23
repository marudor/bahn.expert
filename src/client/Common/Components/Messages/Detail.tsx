import { HimIrisMessage } from 'client/Common/Components/Messages/HimIrisMessage';
import { IrisMessage } from 'client/Common/Components/Messages/IrisMessage';
import { MessageContainer } from './Normal';
import { useMatchedMessages } from 'client/Common/hooks/useMatchedMessages';
import type { Abfahrt, Message } from 'types/iris';
import type { FC } from 'react';

interface Props {
  messages: Message[];
  abfahrt?: Abfahrt;
}

export const DetailMessages: FC<Props> = ({ messages, abfahrt }) => {
  const matchedMessages = useMatchedMessages(messages, abfahrt);

  return (
    <MessageContainer>
      {matchedMessages.map((m, i) => {
        const MessageComponent =
          'head' in m || 'message' in m ? HimIrisMessage : IrisMessage;

        return <MessageComponent key={i} message={m as any} />;
      })}
    </MessageContainer>
  );
};
