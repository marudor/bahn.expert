import { BaseHeader } from '../BaseHeader';
import { DetailsContext } from './DetailsContext';
import { format } from 'date-fns';
import { makeStyles, Tooltip } from '@material-ui/core';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { useContext } from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  wrap: {
    fontSize: '90%',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr min-content 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridTemplateAreas: '"p a g" "o a g" "d a g"',
    alignItems: 'center',
    justifyItems: 'center',
  },
  singleLine: theme.mixins.singleLineText,
  operator: {
    gridArea: 'o',
  },
  date: {
    gridArea: 'd',
  },
  destination: {
    gridArea: 'g',
  },
  arrow: {
    gridArea: 'a',
    minWidth: '1.5em',
  },
}));

interface Props {
  train: string;
}
export const Header = ({ train }: Props) => {
  const classes = useStyles();
  const { details } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;

  return (
    <BaseHeader>
      <div className={classes.wrap} data-testid="detailsHeader">
        <span className={classes.singleLine}>
          {trainText}
          {details?.plannedSequence && (
            <PlannedType plannedSequence={details.plannedSequence} />
          )}
        </span>
        {details && (
          <>
            {details.train.operator && (
              <Tooltip title={details.train.operator.name}>
                <span className={clsx(classes.operator, classes.singleLine)}>
                  {details.train.operator.name}
                </span>
              </Tooltip>
            )}
            <span className={clsx(classes.date, classes.singleLine)}>
              {format(details.departure.time, 'dd.MM.yyyy')}
            </span>
            <span className={classes.arrow}> -&gt; </span>
            <span className={classes.destination}>
              {details.segmentDestination.title}
            </span>
          </>
        )}
      </div>
    </BaseHeader>
  );
};
