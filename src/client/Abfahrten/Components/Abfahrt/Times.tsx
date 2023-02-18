/* eslint no-nested-ternary: 0 */
import { Time } from '@/client/Common/Components/Time';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import styled from '@emotion/styled';
import type { FC } from 'react';

const TimeContainer = styled.div<{ cancelled?: boolean }>(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    '& > span': {
      color: theme.palette.text.primary,
      whiteSpace: 'pre-wrap',
    },
  }),
  ({ theme, cancelled }) => cancelled && theme.mixins.cancelled,
);

export const Times: FC = () => {
  const {
    abfahrt: { cancelled, arrival, departure },
    detail,
  } = useAbfahrt();

  return (
    <div data-testid="times">
      {detail ? (
        <>
          {arrival && (
            <TimeContainer
              cancelled={arrival.cancelled || cancelled}
              data-testid="arrivalTimeContainer"
            >
              <span>{'An: '}</span>
              <Time multiLine delay={arrival.delay} real={arrival.time} />
            </TimeContainer>
          )}
          {departure && (
            <TimeContainer
              cancelled={departure.cancelled || cancelled}
              data-testid="departureTimeContainer"
            >
              <span>{'Ab: '}</span>
              <Time multiLine delay={departure.delay} real={departure.time} />
            </TimeContainer>
          )}
        </>
      ) : departure && (!departure.cancelled || cancelled) ? (
        <Time
          multiLine
          delay={departure.delay}
          real={departure.time}
          cancelled={cancelled}
        />
      ) : (
        arrival && (
          <Time
            multiLine
            delay={arrival.delay}
            real={arrival.time}
            cancelled={cancelled}
          />
        )
      )}
    </div>
  );
};
