import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import type { IrisMessage as IrisMessageType } from 'types/iris';

const useStyles = makeStyles((theme) => ({
  superseded: theme.mixins.cancelled,
}));

interface Props {
  message: IrisMessageType;
  today?: number;
}

export const IrisMessage = ({
  message,
  today = new Date().getDate(),
}: Props) => {
  const classes = useStyles();
  const ts = new Date(message.timestamp);

  return (
    <div className={clsx(message.superseded && classes.superseded)}>
      {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
      {message.text}
    </div>
  );
};
