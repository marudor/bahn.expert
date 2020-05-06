import { Tooltip } from '@material-ui/core';
import type { PlannedSequence } from 'types/planReihung';

interface Props {
  plannedSequence?: PlannedSequence;
}

const PlannedType = ({ plannedSequence }: Props) => {
  if (!plannedSequence?.short) return null;

  return (
    <Tooltip
      enterTouchDelay={0}
      title={`Planned Type: ${plannedSequence.type}`}
    >
      <span style={{ color: 'lightgray' }}> ({plannedSequence.short})</span>
    </Tooltip>
  );
};

export default PlannedType;
