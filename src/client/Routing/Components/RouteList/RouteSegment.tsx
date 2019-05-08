import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Route$JourneySegment } from 'types/routing';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import cc from 'classnames';
import Platform from 'Common/Components/Platform';
import React, { useMemo } from 'react';
import StopList from './StopList';
import Time from 'Common/Components/Time';

type OwnProps = {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick: () => void;
};
type Props = OwnProps & WithStyles<typeof styles>;
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
        <div className={classes.trainInfo}>
          <span className={classes.trainMargin}>{segment.train}</span>
          <span className={cc(classes.trainMargin, classes.destination)}>
            {segment.finalDestination}
          </span>
          {segment.auslastung && (
            <AuslastungsDisplay auslastung={segment.auslastung} />
          )}
        </div>
        {detail && <StopList stops={segment.stops} />}
      </div>
    ),
    [classes, segment, detail, onTrainClick]
  );

  return (
    <>
      <div className={cc(classes.main)}>
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

const styles = createStyles(theme => ({
  main: {
    paddingLeft: '0.3em',
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
    paddingLeft: '.3em',
  },
  trainInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  trainMargin: {
    marginRight: '.5em',
  },
  destination: {
    flex: 1,
    textAlign: 'center',
  },
  platform: {
    textAlign: 'end',
  },
}));

export default withStyles(styles)(RouteSegment);
