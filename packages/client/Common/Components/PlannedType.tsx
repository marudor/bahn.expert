import { makeStyles, Tooltip } from '@material-ui/core';
import type { PlannedSequence } from 'types/planReihung';

const useStyles = makeStyles({
  wrap: {
    color: 'lightgray',
  },
});

interface Props {
  plannedSequence?: PlannedSequence;
}

export const PlannedType = ({ plannedSequence }: Props) => {
  const classes = useStyles();
  if (!plannedSequence?.short) return null;

  return (
    <Tooltip
      enterTouchDelay={0}
      title={`Planned Type: ${plannedSequence.type}`}
    >
      <span className={classes.wrap}> ({plannedSequence.short})</span>
    </Tooltip>
  );
};
