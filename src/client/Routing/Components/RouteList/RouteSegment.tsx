import { css } from '@emotion/react';
import { JnySegmentTrain } from './SegmentTrainComponent/JnySegmentTrain';
import { Platform } from 'client/Common/Components/Platform';
import { Time } from 'client/Common/Components/Time';
import { WalkSegmentTrain } from './SegmentTrainComponent/WalkSegmentTrain';
import styled from '@emotion/styled';
import type { FC, MouseEvent } from 'react';
import type { Route$JourneySegment } from 'types/routing';

const DepartureTime = styled(Time)`
  grid-area: dt;
`;

const DepartureName = styled.span`
  grid-area: dn;
`;

const DeparturePlatform = styled(Platform)`
  grid-area: dp;
`;

const ArrivalTime = styled(Time)`
  grid-area: at;
`;

const ArrivalName = styled.span`
  grid-area: an;
`;

const ArrivalPlatform = styled(Platform)`
  grid-area: ap;
`;

const segmentCss = css`
  margin: 0.5em 0;
  grid-area: t;
  align-self: center;
  padding-left: 0.3em;
  overflow: hidden;
`;

const JourneySegment = styled(JnySegmentTrain)(segmentCss);

const WalkSegment = styled(WalkSegmentTrain)(segmentCss);

const Container = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.shadedBackground,
  padding: '.4em',
  display: 'grid',
  gridTemplateColumns: '2fr 7fr 1fr',
  gridTemplateRows: '1fr auto 1fr',
  gridTemplateAreas: '"dt dn dp" "t t t" "at an ap"',
  margin: '1em 0',
}));

interface Props {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick?: (e: MouseEvent) => void;
}

export const RouteSegment: FC<Props> = ({ segment, detail, onTrainClick }) => {
  return (
    <>
      <Container>
        <DepartureTime
          real={segment.departure.time}
          delay={segment.departure.delay}
        />
        <DepartureName>{segment.segmentStart.title}</DepartureName>

        <ArrivalTime
          real={segment.arrival.time}
          delay={segment.arrival.delay}
        />
        <ArrivalName>{segment.segmentDestination.title}</ArrivalName>
        {segment.type === 'JNY' && (
          <>
            <DeparturePlatform
              real={segment.departure.platform}
              scheduled={segment.departure.scheduledPlatform}
            />
            <ArrivalPlatform
              real={segment.arrival.platform}
              scheduled={segment.arrival.scheduledPlatform}
            />
          </>
        )}
        {segment.type === 'JNY' ? (
          <JourneySegment
            detail={detail}
            segment={segment}
            onTrainClick={onTrainClick}
          />
        ) : (
          <WalkSegment segment={segment} />
        )}
      </Container>
      {'changeDuration' in segment && (
        <span>{segment.changeDuration} Minuten Umsteigezeit</span>
      )}
    </>
  );
};
