/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import cc from 'clsx';
import Time from 'Common/Components/Time';
import useStyles from './Times.style';

type StateProps = {
  timeConfig: boolean;
};
type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};
export type ReduxProps = StateProps & OwnProps;

type Props = ReduxProps;

const Times = ({
  timeConfig,

  abfahrt: { arrival, departure, isCancelled },

  detail,
}: Props) => {
  const classes = useStyles();

  return (
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
                [classes.cancelled]: arrival.isCancelled,
              })}
            >
              <span>{'An: '}</span>
              <Time
                alignEnd
                delay={arrival.delay}
                real={arrival.time}
                showOriginalTime={!timeConfig}
              />
            </div>
          )}
          {departure && (
            <div
              className={cc(classes.wrapper, {
                [classes.cancelled]: departure.isCancelled,
              })}
            >
              <span>{'Ab: '}</span>
              <Time
                alignEnd
                delay={departure.delay}
                real={departure.time}
                showOriginalTime={!timeConfig}
              />
            </div>
          )}
        </React.Fragment>
      ) : departure && (!departure.isCancelled || isCancelled) ? (
        <Time
          alignEnd
          delay={departure.delay}
          real={departure.time}
          showOriginalTime={!timeConfig}
        />
      ) : (
        arrival && (
          <Time
            alignEnd
            delay={arrival.delay}
            real={arrival.time}
            showOriginalTime={!timeConfig}
          />
        )
      )}
    </div>
  );
};

export default connect<StateProps, {}, OwnProps, AbfahrtenState>(state => ({
  timeConfig: state.abfahrtenConfig.config.time,
}))(Times);
