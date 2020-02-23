import { format } from 'date-fns';
import { Tooltip } from '@material-ui/core';
import BaseHeader from '../BaseHeader';
import DetailsContext from './DetailsContext';
import PlannedType from 'Common/Components/PlannedType';
import React, { useContext } from 'react';
import useStyles from './Header.style';

interface Props {
  train: string;
}
const Header = ({ train }: Props) => {
  const classes = useStyles();
  const { details } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;

  return (
    <BaseHeader>
      <div className={classes.wrap}>
        <span className={classes.product}>
          {trainText}
          {details?.plannedSequence && (
            <PlannedType plannedSequence={details.plannedSequence} />
          )}
        </span>
        {details && (
          <>
            {details.train.operator && (
              <Tooltip title={details.train.operator.name}>
                <span className={classes.operator}>
                  {details.train.operator.name}
                </span>
              </Tooltip>
            )}
            <span className={classes.date}>
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

export default Header;
