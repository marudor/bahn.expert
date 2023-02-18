/* eslint no-nested-ternary: 0 */
import { format, subMinutes } from 'date-fns';
import styled from '@emotion/styled';
import type { FC } from 'react';

const DelayContainer = styled.span<{ early?: boolean; delayed?: boolean }>(
  ({ theme, early }) => early && theme.mixins.early,
  ({ theme, delayed }) => delayed && theme.mixins.delayed,
);

const Container = styled(DelayContainer.withComponent('div'))<{
  cancelled?: boolean;
  multiLine?: boolean;
}>(
  {
    fontSize: '0.9em',
    display: 'flex',
  },
  ({ theme, cancelled }) => cancelled && theme.mixins.cancelled,
  ({ multiLine }) => multiLine && { flexDirection: 'column' },
);

const TimeContainer = styled.span<{
  isRealTime?: boolean;
  early?: boolean;
  delayed?: boolean;
}>(
  {
    marginRight: '.2em',
  },
  ({ isRealTime }) => isRealTime && { fontWeight: 'bold' },
  ({ theme, early }) => early && theme.mixins.early,
  ({ theme, delayed }) => delayed && theme.mixins.delayed,
);

interface Props {
  className?: string;
  delay?: number;
  real?: Date;
  cancelled?: boolean;
  /** Not Schedule, not preview */
  isRealTime?: boolean;
  multiLine?: boolean;
}

export const Time: FC<Props> = ({
  className,
  delay,
  real,
  cancelled,
  isRealTime,
  multiLine,
}) => {
  if (!real) return null;
  const scheduledTime = delay ? subMinutes(real, delay) : real;

  return (
    <Container
      data-testid="timeContainer"
      className={className}
      cancelled={cancelled}
      multiLine={multiLine}
    >
      <TimeContainer data-testid="scheduledTime">
        {format(scheduledTime, 'HH:mm')}
      </TimeContainer>
      {delay != null && (
        <TimeContainer
          data-testid="realTime"
          isRealTime={isRealTime}
          early={delay != null && delay <= 0}
          delayed={delay != null && delay > 0}
        >
          {format(real, 'HH:mm')}
        </TimeContainer>
      )}
    </Container>
  );
};
