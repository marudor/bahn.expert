import { cancelledCss } from 'client/util/cssUtils';
import { format } from 'date-fns';
import styled from 'styled-components/macro';
import type { IrisMessage as IrisMessageType } from 'types/iris';

interface Props {
  message: IrisMessageType;
  today?: number;
}

const IrisMessageWrap = styled.div<{ superseded?: boolean }>`
  ${({ superseded }) => superseded && cancelledCss}
`;

const IrisMessage = ({ message, today = new Date().getDate() }: Props) => {
  const ts = new Date(message.timestamp);

  return (
    <IrisMessageWrap superseded={message.superseded}>
      {format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
      {message.text}
    </IrisMessageWrap>
  );
};

export default IrisMessage;
