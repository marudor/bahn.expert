import { Abfahrt } from 'types/abfahrten';
import cc from 'clsx';
import Info from './Info';
import React from 'react';
import useStyles from './Mid.style';

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
      <Info abfahrt={abfahrt} detail={detail} />
      <div
        className={cc(classes.destination, {
          [classes.cancelled]: abfahrt.cancelled,
          [classes.different]:
            !abfahrt.cancelled &&
            abfahrt.destination !== abfahrt.scheduledDestination,
        })}
      >
        {abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
      </div>
    </div>
  );
};

export default Mid;
