// @flow
/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { connect } from 'react-redux';
import cc from 'classnames';
import styles from './Times.styles';
import Time from 'Common/Components/Time';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';

type StateProps = {|
  +timeConfig: boolean,
|};
type OwnProps = {|
  +abfahrt: Abfahrt,
  +detail: boolean,
|};
export type ReduxProps = {|
  ...StateProps,
  ...OwnProps,
  +dispatch: Dispatch<>,
|};

type Props = StyledProps<ReduxProps, typeof styles>;

const Times = ({
  timeConfig,
  abfahrt: { arrival, arrivalIsCancelled, delayArrival, delayDeparture, departure, departureIsCancelled, isCancelled },
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
            <Time alignEnd delay={delayArrival} real={arrival} showOriginalTime={!timeConfig} showZero />
          </div>
        )}
        {departure && (
          <div
            className={cc(classes.wrapper, {
              [classes.cancelled]: departureIsCancelled,
            })}
          >
            <span>{'Ab: '}</span>
            <Time alignEnd delay={delayDeparture} real={departure} showOriginalTime={!timeConfig} showZero />
          </div>
        )}
      </React.Fragment>
    ) : departure && (!departureIsCancelled || isCancelled) ? (
      <Time alignEnd delay={delayDeparture} real={departure} showOriginalTime={!timeConfig} showZero />
    ) : (
      arrival && <Time alignEnd delay={delayArrival} real={arrival} showOriginalTime={!timeConfig} showZero />
    )}
  </div>
);

export default connect<ReduxProps, OwnProps, StateProps, _, AbfahrtenState, _>(state => ({
  timeConfig: state.config.config.time,
}))(withStyles(styles)(Times));
