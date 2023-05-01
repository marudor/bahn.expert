import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { format, getDate } from 'date-fns';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';
import type { Message } from '@/types/iris';

const Container = styled.div<{ superseded?: boolean }>(
  {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  ({ theme, superseded }) => superseded && theme.mixins.cancelled,
);

interface Props {
  message: Message;
  today?: number;
}

export const HimIrisMessage: FC<Props> = ({
  message,
  today = new Date().getDate(),
}) => {
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

  const headerMessage = 'head' in message ? message.head : message.text;

  const dateWithText = formattedDate
    ? `${formattedDate}: ${headerMessage}`
    : headerMessage;
  const stopPlaceInfo =
    'stopPlace' in message && message.stopPlace
      ? ` - ${message.stopPlace.name}`
      : '';

  const text = `${
    dateWithText.endsWith('.') ? dateWithText.slice(0, -1) : dateWithText
  }${stopPlaceInfo}`;

  return (
    <Container superseded={message.superseded}>
      <span onClick={toggleOpen}>{text}</span>
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>{text}</DialogTitle>
        <DialogContent
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        />
      </Dialog>
    </Container>
  );
};
