import { format } from 'date-fns';
import { styled } from '@mui/material';
import type { FC } from 'react';
import type { IrisMessage as IrisMessageType } from '@/types/iris';

const Container = styled('div')<{ superseded?: boolean }>(
  ({ theme, superseded }) => superseded && theme.mixins.cancelled,
);

interface Props {
  message: IrisMessageType;
  today?: number;
}

export const IrisMessage: FC<Props> = ({
  message,
  today = new Date().getDate(),
}) => {
  const ts = message.timestamp;

  return (
    <Container superseded={message.superseded}>
      {ts && format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
      {message.text}
    </Container>
  );
};
