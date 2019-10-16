/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { Abfahrt } from 'types/api/iris';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import cc from 'clsx';
import Time from 'Common/Components/Time';
import useStyles from './Times.style';

type Props = {
  abfahrt: Abfahrt;
  detail: boolean;
};

const Times = ({
  abfahrt: { arrival, departure, cancelled },
  detail,
}: Props) => {
  const timeConfig = AbfahrtenConfigContainer.useContainer().config.time;
  const classes = useStyles();

  return (
    <div
      className={cc({
        [classes.cancelled]: cancelled,
      })}
    >
      {detail ? (
        <React.Fragment>
          {arrival && (
            <div
              className={cc(classes.wrapper, {
                [classes.cancelled]: arrival.cancelled,
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
                [classes.cancelled]: departure.cancelled,
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
      ) : departure && (!departure.cancelled || cancelled) ? (
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

export default Times;
