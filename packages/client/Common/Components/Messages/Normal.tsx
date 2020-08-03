import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import type { Message } from 'types/iris';

export const useStyles = makeStyles((theme) => ({
  wrap: {
    color: theme.colors.red,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface Props {
  messages: Message[];
}
export const NormalMessages = ({ messages }: Props) => {
  const classes = useStyles();
  const messagesDisplay = useMemo(
    () => messages.map((m) => ('head' in m ? m.head : m.text)).join(' +++ '),
    [messages]
  );

  return <div className={classes.wrap}>{messagesDisplay}</div>;
};
