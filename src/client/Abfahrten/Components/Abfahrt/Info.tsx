import { Abfahrt, Message } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import cc from 'clsx';
import DetailMessages from 'Common/Components/Messages/Detail';
import DetailVia from './Via/Detail';
import NormalMessages from 'Common/Components/Messages/Normal';
import NormalVia from './Via/Normal';
import React, { useMemo } from 'react';
import useStyles from './Info.style';

type StateProps = {
  showSupersededMessages: boolean;
};

type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};

export type ReduxProps = StateProps & OwnProps;

type Props = ReduxProps;
const Via = ({ abfahrt, detail, showSupersededMessages }: Props) => {
  const classes = useStyles();
  const messages = useMemo(() => {
    const messages = new Set<Message>();

    if (!detail && abfahrt.messages.delay.length) {
      messages.add(abfahrt.messages.delay[0]);
    }
    abfahrt.messages.delay.forEach(messages.add.bind(messages));
    abfahrt.messages.qos.forEach(messages.add.bind(messages));

    if (!detail || !showSupersededMessages) {
      return [...messages].filter(m => !m.superseded);
    }

    return [...messages];
  }, [abfahrt, detail, showSupersededMessages]);
  const MessagesComp = detail ? DetailMessages : NormalMessages;
  const ViaComp = detail ? DetailVia : NormalVia;

  const info = Boolean(messages.length) && (
    <MessagesComp messages={messages} cancelled={abfahrt.cancelled} />
  );
  const via = (detail || !info) && <ViaComp stops={abfahrt.route} />;

  if (!info && !via) return null;

  return (
    <div
      className={cc(classes.main, {
        [classes.detail]: detail,
      })}
    >
      {info}
      {via}
    </div>
  );
};

export default connect<StateProps, void, OwnProps, AbfahrtenState>(state => ({
  showSupersededMessages: state.abfahrtenConfig.config.showSupersededMessages,
}))(Via);
