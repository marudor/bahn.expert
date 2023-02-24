/* eslint no-nested-ternary: 0 */
import { format, subMinutes } from 'date-fns';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
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
  multiLine?: boolean;
}>(
  ({ multiLine }) =>
    !multiLine && {
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

function delayString(delay: number) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

export const Time: FC<Props> = ({
  className,
  delay,
  real,
  cancelled,
  isRealTime,
  multiLine,
}) => {
  const showDelayTime = useCommonConfig().delayTime;
  if (!real) return null;
  const hasDelay = delay != null;
  // Wenn mit Delay dann immer Echtzeit, sonst plan
  const timeToDisplay = showDelayTime
    ? real
    : hasDelay
    ? subMinutes(real, delay)
    : real;

  return (
    <Container
      data-testid="timeContainer"
      className={className}
      cancelled={cancelled}
      multiLine={multiLine}
    >
      <TimeContainer
        multiLine={multiLine}
        data-testid="timeToDisplay"
        early={showDelayTime && hasDelay && delay <= 0}
        delayed={showDelayTime && hasDelay && delay > 0}
      >
        {format(timeToDisplay, 'HH:mm')}
      </TimeContainer>
      {hasDelay && (
        <TimeContainer
          multiLine={multiLine}
          data-testid="realTimeOrDelay"
          isRealTime={!showDelayTime && isRealTime}
          early={delay <= 0}
          delayed={delay > 0}
        >
          {showDelayTime ? delayString(delay) : format(real, 'HH:mm')}
        </TimeContainer>
      )}
    </Container>
  );
};
