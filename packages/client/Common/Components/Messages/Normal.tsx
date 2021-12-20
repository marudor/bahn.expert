import { useMemo } from 'react';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { Message } from 'types/iris';

export const MessageContainer = styled.div(({ theme }) => ({
  color: theme.colors.red,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

interface Props {
  messages: Message[];
}
export const NormalMessages: FC<Props> = ({ messages }) => {
  const messagesDisplay = useMemo(
    () => messages.map((m) => ('head' in m ? m.head : m.text)).join(' +++ '),
    [messages],
  );

  return <MessageContainer>{messagesDisplay}</MessageContainer>;
};
