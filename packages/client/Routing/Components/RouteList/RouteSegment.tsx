import JnySegmentTrain from './SegmentTrainComponent/JnySegmentTrain';
import Platform from 'client/Common/Components/Platform';
import styled from 'styled-components/macro';
import Time from 'client/Common/Components/Time';
import WalkSegmentTrain from './SegmentTrainComponent/WalkSegmentTrain';
import type { MouseEvent } from 'react';
import type { Route$JourneySegment } from 'types/routing';

const MainWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.shadedBackground};
  padding: 0.4em;
  display: grid;
  grid-template-columns: 2fr 7fr 1fr;
  grid-template-rows: 1fr auto 1fr;
  grid-template-areas: 'dt dn dp' 't t t' 'at an ap';
  margin: 1em 0;
`;

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
const JnyTrain = styled(JnySegmentTrain)`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  grid-area: t;
  align-self: center;
  padding-left: 0.3em;
  overflow: hidden;
`;

const WalkTrain = JnyTrain.withComponent(WalkSegmentTrain);

interface Props {
  segment: Route$JourneySegment;
  detail?: boolean;
  onTrainClick?: (e: MouseEvent) => void;
}

const RouteSegment = ({ segment, detail, onTrainClick }: Props) => (
  <>
    <MainWrap>
      <DepartureTime
        real={segment.departure.time}
        delay={segment.departure.delay}
      />
      <DepartureName>{segment.segmentStart.title}</DepartureName>

      <ArrivalTime real={segment.arrival.time} delay={segment.arrival.delay} />
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
        <JnyTrain
          detail={detail}
          segment={segment}
          onTrainClick={onTrainClick}
        />
      ) : (
        <WalkTrain segment={segment} />
      )}
    </MainWrap>
    {'changeDuration' in segment && (
      <span>{segment.changeDuration} Minuten Umsteigezeit</span>
    )}
  </>
);

export default RouteSegment;
