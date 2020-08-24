import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { format, getDate } from 'date-fns';
import { stopPropagation } from 'client/Common/stopPropagation';
import { SyntheticEvent, useCallback, useState } from 'react';
import clsx from 'clsx';
import type { HimIrisMessage as HimIrisMessageType } from 'types/iris';

const useStyles = makeStyles((theme) => ({
  wrap: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  superseded: theme.mixins.cancelled,
}));

interface Props {
  message: HimIrisMessageType;
  today?: number;
}

export const HimIrisMessage = ({
  message,
  today = new Date().getDate(),
}: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((old) => !old);
  }, []);
  const formattedDate =
    message.timestamp &&
    format(
      message.timestamp,
      getDate(message.timestamp) === today ? 'HH:mm' : 'dd.MM HH:mm',
    );

  const dateWithText = formattedDate
    ? `${formattedDate}: ${message.head}`
    : message.head;

  return (
    <div
      className={clsx(classes.wrap, message.superseded && classes.superseded)}
      onClick={toggleOpen}
    >
      {dateWithText}
      <Dialog open={open} onClose={toggleOpen} onClick={stopPropagation}>
        <DialogTitle>{dateWithText}</DialogTitle>
        <DialogContent
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        />
      </Dialog>
    </div>
  );
};
