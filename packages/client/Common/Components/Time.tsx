/* eslint no-nested-ternary: 0 */
import { cancelledCss, delayCss, earlyCss } from 'client/util/cssUtils';
import { CommonConfigContainer } from 'client/Common/container/CommonConfigContainer';
import { format, subMinutes } from 'date-fns';
import styled, { css } from 'styled-components';

const DelayOrEarlyCss = css<{ delay?: number; hasDelay: boolean }>`
  ${({ delay, hasDelay }) =>
    hasDelay && (delay && delay > 0 ? delayCss : earlyCss)}
`;
const Delay = styled.span`
  ${DelayOrEarlyCss}
`;

const Wrap = styled.div<{
  showOriginalTime?: boolean;
  delay?: number;
  hasDelay: boolean;
  alignEnd?: boolean;
  oneLine?: boolean;
  cancelled?: boolean;
}>`
  display: flex;
  ${({ showOriginalTime }) => !showOriginalTime && DelayOrEarlyCss};
  ${({ alignEnd }) =>
    alignEnd &&
    css`
      align-items: flex-end;
    `};
  ${({ oneLine }) =>
    !oneLine &&
    css`
      flex-direction: column;
    `};
  ${({ cancelled }) => cancelled && cancelledCss};
`;

const TimeDisplay = styled.span<{ oneLine?: boolean }>`
  ${({ oneLine }) =>
    oneLine &&
    css`
      margin-right: 0.2em;
    `}
`;

interface Props {
  alignEnd?: boolean;
  className?: string;
  delay?: number;
  real?: number;
  showZero?: boolean;
  oneLine?: boolean;
  cancelled?: boolean;
}

function delayString(delay: number) {
  if (delay < 0) {
    return `-${Math.abs(delay)}`;
  }

  return `+${delay}`;
}

export const Time = ({
  className,
  delay,
  real,
  showZero = true,
  alignEnd,
  oneLine,
  cancelled,
}: Props) => {
  const showOriginalTime = !CommonConfigContainer.useContainer().config.time;

  if (!real) return null;
  const time = showOriginalTime && delay ? subMinutes(real, delay) : real;

  const hasDelay = showZero ? delay != null : Boolean(delay);

  return (
    <Wrap
      className={className}
      showOriginalTime={showOriginalTime}
      alignEnd={alignEnd}
      oneLine={oneLine}
      cancelled={cancelled}
      hasDelay={hasDelay}
      delay={delay}
    >
      <TimeDisplay data-testid="time" oneLine={oneLine}>
        {format(time, 'HH:mm')}
      </TimeDisplay>
      {hasDelay && (
        <Delay delay={delay} hasDelay={hasDelay} data-testid="delay">
          {delayString(delay as number)}
        </Delay>
      )}
    </Wrap>
  );
};
