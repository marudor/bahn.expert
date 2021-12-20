import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { format, getDate } from 'date-fns';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';
import type { HimIrisMessage as HimIrisMessageType } from 'types/iris';

const Container = styled.div<{ superseded?: boolean }>(
  {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  ({ theme, superseded }) => superseded && theme.mixins.cancelled,
);

interface Props {
  message: HimIrisMessageType;
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

  const dateWithText = formattedDate
    ? `${formattedDate}: ${message.head}`
    : message.head;
  const stopPlaceInfo = message.stopPlace
    ? ` - ${message.stopPlace.title}`
    : null;

  return (
    <Container superseded={message.superseded} onClick={toggleOpen}>
      {dateWithText}
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>
          {dateWithText}
          {stopPlaceInfo}
        </DialogTitle>
        <DialogContent
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        />
      </Dialog>
    </Container>
  );
};
