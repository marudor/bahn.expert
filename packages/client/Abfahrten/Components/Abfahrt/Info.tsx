import { DetailMessages } from 'client/Common/Components/Messages/Detail';
import { DetailVia } from './Via/Detail';
import { makeStyles } from '@material-ui/core';
import { NormalMessages } from 'client/Common/Components/Messages/Normal';
import { NormalVia } from './Via/Normal';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useMemo } from 'react';
import clsx from 'clsx';

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

export const Info = () => {
  const { abfahrt, detail } = useAbfahrt();
  const classes = useStyles();
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
    <div className={clsx(classes.wrap, !detail && classes.noDetail)}>
      {info}
      {via}
    </div>
  );
};
