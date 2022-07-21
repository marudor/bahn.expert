import { DetailMessages } from 'client/Common/Components/Messages/Detail';
import { DetailVia } from './Via/Detail';
import { NormalMessages } from 'client/Common/Components/Messages/Normal';
import { NormalVia } from './Via/Normal';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.div`
  font-size: 2.1em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Info: FC = () => {
  const { abfahrt, detail } = useAbfahrt();
  const messages = useMemo(() => {
    const messages = abfahrt.messages.delay
      .concat(abfahrt.messages.qos)
      .concat(abfahrt.messages.him);

    if (!detail) {
      return messages.filter((m) => !m.superseded);
    }

    return messages;
  }, [abfahrt.messages, detail]);
  const MessagesComp = detail ? DetailMessages : NormalMessages;
  const ViaComp = detail ? DetailVia : NormalVia;

  const info = Boolean(messages.length) && <MessagesComp messages={messages} />;
  const via = (detail || !info) && <ViaComp stops={abfahrt.route} />;

  if (!info && !via) return null;

  return (
    <Container>
      {info}
      {via}
    </Container>
  );
};
