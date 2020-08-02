import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import { DetailMessages } from 'client/Common/Components/Messages/Detail';
import { DetailVia } from './Via/Detail';
import { makeStyles } from '@material-ui/core';
import { NormalMessages } from 'client/Common/Components/Messages/Normal';
import { NormalVia } from './Via/Normal';
import { useMemo } from 'react';
import clsx from 'clsx';
import type { Abfahrt } from 'types/iris';

const useStyles = makeStyles({
  wrap: {
    fontSize: '2.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  noDetail: {
    whiteSpace: 'nowrap',
  },
});

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}
export const Info = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();
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

  if (!info && !via) return null;

  return (
    <div className={clsx(classes.wrap, !detail && classes.noDetail)}>
      {info}
      {via}
    </div>
  );
};
