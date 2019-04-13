// @flow
import React from 'react';
import Time from 'Common/Components/Time';
import withStyles, { type StyledProps } from 'react-jss';
import type { Route$JourneySegment } from 'types/routing';

type OwnProps = {|
  segment: Route$JourneySegment,
|};
type Props = StyledProps<OwnProps, typeof styles>;
const RouteSegment = ({ segment, classes }: Props) => (
  <>
    <div className={classes.main}>
      <Time real={segment.departure} delay={segment.departureDelay} />
      <span>{segment.segmentStart.title}</span>
      <span className={classes.platform}>{segment.departurePlatform}</span>
      <div className={classes.train}>
        <span>{segment.train}</span>
        <span>{segment.finalDestination}</span>
      </div>
      <Time real={segment.arrival} delay={segment.arrivalDelay} />
      <span>{segment.segmentDestination.title}</span>
      <span className={classes.platform}>{segment.arrivalPlatform}</span>
    </div>
    {segment.hasOwnProperty('changeDuration') && (
      <span>{segment.changeDuration} Minuten Umsteigezeit</span>
    )}
  </>
);

const styles = {
  main: {
    paddingLeft: '1em',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr max-content 1fr',
    gridTemplateAreas: '". . ." "t t t" ". . ."',
    marginTop: '1em',
    marginBottom: '1em',
  },
  train: {
    marginTop: '.5em',
    marginBottom: '.5em',
    gridArea: 't',
    paddingLeft: '.5em',
    '& > span:first-child': {
      marginRight: '.5em',
    },
  },
  platform: {
    textAlign: 'end',
  },
};

export default withStyles(styles)(RouteSegment);
