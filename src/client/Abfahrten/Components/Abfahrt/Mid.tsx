import { Abfahrt } from 'types/abfahrten';
import { withStyles, WithStyles } from '@material-ui/styles';
import cc from 'classnames';
import React from 'react';
import styles from './Mid.styles';
import Via from './Via';

export type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Mid = ({ abfahrt, detail, classes }: Props) => (
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
      {abfahrt.isCancelled ? abfahrt.scheduledDestination : abfahrt.destination}
    </div>
  </div>
);

export default React.memo(withStyles(styles, { withTheme: true })(Mid));
