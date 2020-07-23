import { useMemo } from 'react';
import styled from 'styled-components/macro';
import type { Message } from 'types/iris';

export const MessagesWrap = styled.div`
  color: ${({ theme }) => theme.colors.red};
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  messages: Message[];
}
const NormalMessages = ({ messages }: Props) => {
  const messagesDisplay = useMemo(
    () => messages.map((m) => ('head' in m ? m.head : m.text)).join(' +++ '),
    [messages]
  );

  return <MessagesWrap>{messagesDisplay}</MessagesWrap>;
};

export default NormalMessages;
