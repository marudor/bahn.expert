import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { format, getDate } from 'date-fns';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';
import type { HimIrisMessage as HimIrisMessageType } from '@/types/iris';

const Container = styled.div<{ superseded?: boolean }>(
  {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  ({ theme, superseded }) => superseded && theme.mixins.cancelled,
);

const SmallSpan = styled.span`
  font-size: 75%;
`;

interface Props {
  message: HimIrisMessageType;
  today?: number;
  withStopPlaceInfo?: boolean;
}

export const HimIrisMessage: FC<Props> = ({
  message,
  today = new Date().getDate(),
  withStopPlaceInfo,
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

  const headerMessage = message.head;

  const dateWithText = formattedDate
    ? `${formattedDate}: ${headerMessage}`
    : headerMessage;

  let text = dateWithText;
  if (message.stopPlaceInfo && withStopPlaceInfo) {
    text += ` (${message.stopPlaceInfo})`;
  }

  return (
    <Container superseded={message.superseded}>
      <span onClick={toggleOpen}>{text}</span>
      <Dialog open={open} onClose={toggleOpen}>
        <Stack component={DialogTitle} flexDirection="column">
          <span>{dateWithText}</span>
          <SmallSpan>{message.stopPlaceInfo}</SmallSpan>
        </Stack>
        <DialogContent
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        />
        {message.source && (
          <DialogActions>Quelle: {message.source}</DialogActions>
        )}
      </Dialog>
    </Container>
  );
};
