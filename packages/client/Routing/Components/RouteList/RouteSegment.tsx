import { JnySegmentTrain } from './SegmentTrainComponent/JnySegmentTrain';
import { makeStyles } from '@material-ui/core';
import { Platform } from 'client/Common/Components/Platform';
import { Time } from 'client/Common/Components/Time';
import { WalkSegmentTrain } from './SegmentTrainComponent/WalkSegmentTrain';
import type { FC, MouseEvent } from 'react';
import type { Route$JourneySegment } from 'types/routing';

const useStyles = makeStyles((theme) => ({
  wrap: {
    backgroundColor: theme.colors.shadedBackground,
    padding: '.4em',
    display: 'grid',
    gridTemplateColumns: '2fr 7fr 1fr',
    gridTemplateRows: '1fr auto 1fr',
    gridTemplateAreas: '"dt dn dp" "t t t" "at an ap"',
    margin: '1em 0',
  },
  departureTime: {
    gridArea: 'dt',
  },
  departureName: {
    gridArea: 'dn',
  },
  departurePlatform: {
    gridArea: 'dp',
  },
  arrivalTime: {
    gridArea: 'at',
  },
  arrivalName: {
    gridArea: 'an',
  },
  arrivalPlatform: {
    gridArea: 'ap',
  },
  segment: {
    margin: '.5em 0',
    gridArea: 't',
    alignSelf: 'center',
    paddingLeft: '.3em',
    overflow: 'hidden',
  },
}));

interface Props {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick?: (e: MouseEvent) => void;
}

export const RouteSegment: FC<Props> = ({ segment, detail, onTrainClick }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.wrap}>
        <Time
          className={classes.departureTime}
          real={segment.departure.time}
          delay={segment.departure.delay}
        />
        <span className={classes.departureName}>
          {segment.segmentStart.title}
        </span>

        <Time
          className={classes.arrivalTime}
          real={segment.arrival.time}
          delay={segment.arrival.delay}
        />
        <span className={classes.arrivalName}>
          {segment.segmentDestination.title}
        </span>
        {segment.type === 'JNY' && (
          <>
            <Platform
              className={classes.departurePlatform}
              real={segment.departure.platform}
              scheduled={segment.departure.scheduledPlatform}
            />
            <Platform
              className={classes.arrivalPlatform}
              real={segment.arrival.platform}
              scheduled={segment.arrival.scheduledPlatform}
            />
          </>
        )}
        {segment.type === 'JNY' ? (
          <JnySegmentTrain
            className={classes.segment}
            detail={detail}
            segment={segment}
            onTrainClick={onTrainClick}
          />
        ) : (
          <WalkSegmentTrain className={classes.segment} segment={segment} />
        )}
      </div>
      {'changeDuration' in segment && (
        <span>{segment.changeDuration} Minuten Umsteigezeit</span>
      )}
    </>
  );
};
