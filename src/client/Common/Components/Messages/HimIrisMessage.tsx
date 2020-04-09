import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { format, getDate } from 'date-fns';
import { HimIrisMessage as HimIrisMessageType } from 'types/iris';
import cc from 'clsx';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import useStyles from './index.style';

interface Props {
  message: HimIrisMessageType;
  today?: number;
}

const HimIrisMessage = ({ message, today = new Date().getDate() }: Props) => {
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
      getDate(message.timestamp) === today ? 'HH:mm' : 'dd.MM HH:mm'
    );

  const dateWithText = formattedDate
    ? `${formattedDate}: ${message.head}`
    : message.head;

  return (
    <div
      className={cc(classes.him, {
        [classes.cancelled]: message.superseded,
      })}
      onClick={toggleOpen}
    >
      {dateWithText}
      <Dialog open={open} onClose={toggleOpen}>
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

export default HimIrisMessage;
