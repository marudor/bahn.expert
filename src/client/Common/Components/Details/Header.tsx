import { format } from 'date-fns';
import BaseHeader from '../BaseHeader';
import DetailsContext from './DetailsContext';
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
      <div className={classes.train}>
        <span>{trainText}</span>
        {details && <span>{format(details.departure.time, 'dd.MM.yyyy')}</span>}
      </div>

      {details && (
        <div className={classes.destination}>
          <span> -&gt; </span>
          <span>{details.segmentDestination.title}</span>
        </div>
      )}
    </BaseHeader>
  );
};

export default Header;
