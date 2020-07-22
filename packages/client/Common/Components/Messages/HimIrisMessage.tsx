import { cancelledCss } from 'client/util/cssUtils';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { format, getDate } from 'date-fns';
import { SyntheticEvent, useCallback, useState } from 'react';
import stopPropagation from 'client/Common/stopPropagation';
import styled from 'styled-components/macro';
import type { HimIrisMessage as HimIrisMessageType } from 'types/iris';

interface Props {
  message: HimIrisMessageType;
  today?: number;
}

const Wrap = styled.div<{ superseded?: boolean }>`
  text-decoration: underline;
  cursor: pointer;
  ${({ superseded }) => superseded && cancelledCss}
`;

const HimIrisMessage = ({ message, today = new Date().getDate() }: Props) => {
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
    <Wrap superseded={message.superseded} onClick={toggleOpen}>
      {dateWithText}
      <Dialog open={open} onClose={toggleOpen} onClick={stopPropagation}>
        <DialogTitle>{dateWithText}</DialogTitle>
        <DialogContent
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        />
      </Dialog>
    </Wrap>
  );
};

export default HimIrisMessage;
