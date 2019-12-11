/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { Abfahrt } from 'types/iris';
import cc from 'clsx';
import Time from 'Common/Components/Time';
import useStyles from './Times.style';

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}

const Times = ({
  abfahrt: { arrival, departure, cancelled },
  detail,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={cc(cancelled && classes.cancelled)}>
      {detail ? (
        <React.Fragment>
          {arrival && (
            <div
              className={cc(
                classes.wrapper,
                arrival.cancelled && classes.cancelled
              )}
            >
              <span>{'An: '}</span>
              <Time alignEnd delay={arrival.delay} real={arrival.time} />
            </div>
          )}
          {departure && (
            <div
              className={cc(
                classes.wrapper,
                departure.cancelled && classes.cancelled
              )}
            >
              <span>{'Ab: '}</span>
              <Time alignEnd delay={departure.delay} real={departure.time} />
            </div>
          )}
        </React.Fragment>
      ) : departure && (!departure.cancelled || cancelled) ? (
        <Time alignEnd delay={departure.delay} real={departure.time} />
      ) : (
        arrival && <Time alignEnd delay={arrival.delay} real={arrival.time} />
      )}
    </div>
  );
};

export default Times;
