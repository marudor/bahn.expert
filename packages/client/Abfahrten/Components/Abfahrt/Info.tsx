import { useMemo } from 'react';
import AbfahrtenConfigContainer from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import DetailMessages from 'client/Common/Components/Messages/Detail';
import DetailVia from './Via/Detail';
import NormalMessages from 'client/Common/Components/Messages/Normal';
import NormalVia from './Via/Normal';
import styled from 'styled-components/macro';
import type { Abfahrt } from 'types/iris';

const Wrap = styled.div<{ detail: boolean }>`
  font-size: 2.1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${({ detail }) => (detail ? 'inherit' : 'nowrap')};
`;

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}
const Info = ({ abfahrt, detail }: Props) => {
  const showSupersededMessages = AbfahrtenConfigContainer.useContainer().config
    .showSupersededMessages;
  const messages = useMemo(() => {
    const messages = abfahrt.messages.delay
      .concat(abfahrt.messages.qos)
      .concat(abfahrt.messages.him);

    if (!detail || !showSupersededMessages) {
      return messages.filter((m) => !m.superseded);
    }

    return messages;
  }, [abfahrt.messages, detail, showSupersededMessages]);
  const MessagesComp = detail ? DetailMessages : NormalMessages;
  const ViaComp = detail ? DetailVia : NormalVia;

  const info = Boolean(messages.length) && <MessagesComp messages={messages} />;
  const via = (detail || !info) && <ViaComp stops={abfahrt.route} />;

  return useMemo(() => {
    if (!info && !via) return null;

    return (
      <Wrap detail={detail}>
        {info}
        {via}
      </Wrap>
    );
  }, [detail, info, via]);
};

export default Info;
