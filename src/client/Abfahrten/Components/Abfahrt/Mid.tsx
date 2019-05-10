import { Abfahrt } from 'types/abfahrten';
import cc from 'classnames';
import React from 'react';
import useStyles from './Mid.style';
import Via from './Via';

export type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};

type Props = OwnProps;

const Mid = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();

  return (
    <div
      className={cc(
        {
          [classes.detail]: detail,
        },
        classes.main
      )}
    >
      <Via abfahrt={abfahrt} detail={detail} />
      <div
        className={cc(classes.destination, {
          [classes.cancelled]: abfahrt.isCancelled,
          [classes.different]:
            !abfahrt.isCancelled &&
            abfahrt.destination !== abfahrt.scheduledDestination,
        })}
      >
        {abfahrt.isCancelled
          ? abfahrt.scheduledDestination
          : abfahrt.destination}
      </div>
    </div>
  );
};

export default Mid;
