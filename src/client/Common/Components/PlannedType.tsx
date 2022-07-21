import { Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { PlannedSequence } from 'types/planReihung';

const StyledTooltip = styled(Tooltip)`
  color: lightgray;
`;

interface Props {
  plannedSequence?: PlannedSequence;
}

export const PlannedType: FC<Props> = ({ plannedSequence }) => {
  if (!plannedSequence?.shortType) return null;

  return (
    <StyledTooltip
      enterTouchDelay={0}
      title={`Planned Type: ${plannedSequence.type}`}
    >
      <span> ({plannedSequence.shortType})</span>
    </StyledTooltip>
  );
};
