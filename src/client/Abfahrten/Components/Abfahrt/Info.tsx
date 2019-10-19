import { Abfahrt } from 'types/api/iris';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import cc from 'clsx';
import DetailMessages from 'Common/Components/Messages/Detail';
import DetailVia from './Via/Detail';
import NormalMessages from 'Common/Components/Messages/Normal';
import NormalVia from './Via/Normal';
import React, { useMemo } from 'react';
import useStyles from './Info.style';

type Props = {
  abfahrt: Abfahrt;
  detail: boolean;
};
const Info = ({ abfahrt, detail }: Props) => {
  const showSupersededMessages = AbfahrtenConfigContainer.useContainer().config
    .showSupersededMessages;
  const classes = useStyles();
  const messages = useMemo(() => {
    const messages = abfahrt.messages.delay.concat(abfahrt.messages.qos);

    if (!detail || !showSupersededMessages) {
      return messages.filter(m => !m.superseded);
    }

    return messages;
  }, [abfahrt.messages, detail, showSupersededMessages]);
  const MessagesComp = detail ? DetailMessages : NormalMessages;
  const ViaComp = detail ? DetailVia : NormalVia;

  const info = Boolean(messages.length) && (
    <MessagesComp messages={messages} cancelled={abfahrt.cancelled} />
  );
  const via = (detail || !info) && <ViaComp stops={abfahrt.route} />;

  return useMemo(() => {
    if (!info && !via) return null;

    return (
      <div className={cc(classes.main, detail && classes.detail)}>
        {info}
        {via}
      </div>
    );
  }, [classes, detail, info, via]);
};

export default Info;
