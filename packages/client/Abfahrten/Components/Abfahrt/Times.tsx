/* eslint no-nested-ternary: 0 */
import { cancelledCss } from 'client/util/cssUtils';
import { Time } from 'client/Common/Components/Time';
import styled from 'styled-components';
import type { Abfahrt } from 'types/iris';

const Wrap = styled.div<{ cancelled?: boolean }>`
  ${({ cancelled }) => cancelled && cancelledCss}
`;

const TimeWrapper = styled.div<{ cancelled?: boolean }>`
  display: flex;
  justify-content: flex-end;
  > span {
    color: ${({ theme }) => theme.palette.text.primary};
    white-space: pre-wrap;
  }
  ${({ cancelled }) => cancelled && cancelledCss};
`;
interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}

export const Times = ({
  abfahrt: { arrival, departure, cancelled },
  detail,
}: Props) => (
  <Wrap cancelled={cancelled}>
    {detail ? (
      <>
        {arrival && (
          <TimeWrapper cancelled={arrival.cancelled}>
            <span>{'An: '}</span>
            <Time alignEnd delay={arrival.delay} real={arrival.time} />
          </TimeWrapper>
        )}
        {departure && (
          <TimeWrapper cancelled={departure.cancelled}>
            <span>{'Ab: '}</span>
            <Time alignEnd delay={departure.delay} real={departure.time} />
          </TimeWrapper>
        )}
      </>
    ) : departure && (!departure.cancelled || cancelled) ? (
      <Time alignEnd delay={departure.delay} real={departure.time} />
    ) : (
      arrival && <Time alignEnd delay={arrival.delay} real={arrival.time} />
    )}
  </Wrap>
);
