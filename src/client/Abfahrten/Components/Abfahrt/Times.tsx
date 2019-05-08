/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/styles';
import cc from 'classnames';
import styles from './Times.styles';
import Time from 'Common/Components/Time';

type StateProps = {
  timeConfig: boolean;
};
type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};
export type ReduxProps = StateProps & OwnProps;

type Props = ReduxProps & WithStyles<typeof styles>;

const Times = ({
  timeConfig,
  abfahrt: {
    arrival,
    arrivalIsCancelled,
    delayArrival,
    delayDeparture,
    departure,
    departureIsCancelled,
    isCancelled,
  },
  detail,
  classes,
}: Props) => (
  <div
    className={cc({
      [classes.cancelled]: isCancelled,
    })}
  >
    {detail ? (
      <React.Fragment>
        {arrival && (
          <div
            className={cc(classes.wrapper, {
              [classes.cancelled]: arrivalIsCancelled,
            })}
          >
            <span>{'An: '}</span>
            <Time
              alignEnd
              delay={delayArrival}
              real={arrival}
              showOriginalTime={!timeConfig}
            />
          </div>
        )}
        {departure && (
          <div
            className={cc(classes.wrapper, {
              [classes.cancelled]: departureIsCancelled,
            })}
          >
            <span>{'Ab: '}</span>
            <Time
              alignEnd
              delay={delayDeparture}
              real={departure}
              showOriginalTime={!timeConfig}
            />
          </div>
        )}
      </React.Fragment>
    ) : departure && (!departureIsCancelled || isCancelled) ? (
      <Time
        alignEnd
        delay={delayDeparture}
        real={departure}
        showOriginalTime={!timeConfig}
      />
    ) : (
      arrival && (
        <Time
          alignEnd
          delay={delayArrival}
          real={arrival}
          showOriginalTime={!timeConfig}
        />
      )
    )}
  </div>
);

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  timeConfig: state.abfahrtenConfig.config.time,
}))(withStyles(styles, { withTheme: true })(Times));
