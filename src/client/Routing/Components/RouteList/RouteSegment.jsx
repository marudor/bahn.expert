// @flow
import Platform from 'Common/Components/Platform';
import React, { useMemo } from 'react';
import StopList from './StopList';
import Time from 'Common/Components/Time';
import withStyles, { type StyledProps } from 'react-jss';
import type { Route$JourneySegment } from 'types/routing';

type OwnProps = {|
  segment: Route$JourneySegment,
  detail?: boolean,
  onTrainClick: () => void,
|};
type Props = StyledProps<OwnProps, typeof styles>;
const RouteSegment = ({ segment, classes, detail, onTrainClick }: Props) => {
  const train = useMemo(
    () => (
      <div
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onTrainClick();
        }}
        className={classes.train}
      >
        <div>
          <span className={classes.trainId}>{segment.train}</span>
          <span>{segment.finalDestination}</span>
        </div>
        {detail && <StopList stops={segment.stops} />}
      </div>
    ),
    [classes.train, segment, onTrainClick, detail]
  );

  return (
    <>
      <div className={classes.main}>
        <Time real={segment.departure} delay={segment.departureDelay} />
        <span>{segment.segmentStart.title}</span>
        <Platform
          real={segment.departurePlatform}
          scheduled={segment.scheduledDeparturePlatform}
        />
        {train}
        <Time real={segment.arrival} delay={segment.arrivalDelay} />
        <span>{segment.segmentDestination.title}</span>
        <Platform
          real={segment.arrivalPlatform}
          scheduled={segment.scheduledArrivalPlatform}
        />
      </div>
      {segment.hasOwnProperty('changeDuration') && (
        <span>{segment.changeDuration} Minuten Umsteigezeit</span>
      )}
    </>
  );
};

const styles = {
  main: {
    paddingLeft: '0.6em',
    display: 'grid',
    gridTemplateColumns: '2fr 7fr 1fr',
    gridTemplateRows: '1fr auto 1fr',
    gridTemplateAreas: '". . ." "t t t" ". . ."',
    marginTop: '1em',
    marginBottom: '1em',
  },
  train: {
    marginTop: '.5em',
    marginBottom: '.5em',
    gridArea: 't',
    alignSelf: 'center',
    paddingLeft: '.5em',
  },
  trainId: {
    marginRight: '.5em',
  },
  platform: {
    textAlign: 'end',
  },
};

export default withStyles<Props>(styles)(RouteSegment);
