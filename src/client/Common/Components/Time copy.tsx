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
  alignEnd?: boolean;
  multiLine?: boolean;
  cancelled?: boolean;
}>(
  {
    display: 'flex',
  },
  ({ alignEnd }) =>
    alignEnd && {
      alignItems: 'flex-end',
    },
  ({ multiLine }) =>
    multiLine && {
      flexDirection: 'column',
    },
  ({ theme, cancelled }) => cancelled && theme.mixins.cancelled,
);

const TimeContainer = styled.span<{ oneLine?: boolean; isRealTime?: boolean }>(
  ({ oneLine }) =>
    oneLine && {
      marginRight: '.2em',
    },
  ({ isRealTime }) => isRealTime && { fontWeight: 'bold' },
);

interface Props {
  alignEnd?: boolean;
  className?: string;
  delay?: number;
  real?: Date;
  showZero?: boolean;
  oneLine?: boolean;
  cancelled?: boolean;
  /** Not Schedule, not preview */
  isRealTime?: boolean;
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
  showZero = true,
  alignEnd,
  oneLine,
  cancelled,
  isRealTime,
}) => {
  const showOriginalTime = !useCommonConfig().time;

  if (!real) return null;
  const time = showOriginalTime && delay ? subMinutes(real, delay) : real;

  const hasDelay = showZero ? delay != null : Boolean(delay);

  return (
    <Container
      data-testid="timeContainer"
      className={className}
      delayed={Boolean(
        !showOriginalTime && hasDelay && delay != null && delay > 0,
      )}
      early={Boolean(
        !showOriginalTime && hasDelay && delay != null && delay <= 0,
      )}
      alignEnd={alignEnd}
      multiLine={!oneLine}
      cancelled={cancelled}
    >
      <TimeContainer
        isRealTime={isRealTime}
        oneLine={oneLine}
        data-testid="time"
      >
        {format(time, 'HH:mm')}
      </TimeContainer>
      {hasDelay && (
        <DelayContainer
          delayed={Boolean(delay != null && delay > 0)}
          early={Boolean(delay != null && delay <= 0)}
          data-testid="delay"
        >
          {delayString(delay as number)}
        </DelayContainer>
      )}
    </Container>
  );
};
