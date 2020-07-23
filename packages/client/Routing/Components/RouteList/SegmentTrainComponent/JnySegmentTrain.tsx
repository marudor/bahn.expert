import { Destination, TrainInfo, TrainMargin } from './common';
import AuslastungsDisplay from 'client/Common/Components/AuslastungsDisplay';
import DetailsLink from 'client/Common/Components/Details/DetailsLink';
import PlannedType from 'client/Common/Components/PlannedType';
import Reihung from 'client/Common/Components/Reihung';
import StopList from 'client/Routing/Components/RouteList/StopList';
import styled from 'styled-components/macro';
import type { MouseEvent } from 'react';
import type { Route$JourneySegmentTrain } from 'types/routing';

const StyledReihung = styled(Reihung)`
  font-size: 0.5em;
`;

interface Props {
  segment: Route$JourneySegmentTrain;
  detail?: boolean;
  className?: string;
  onTrainClick?: (e: MouseEvent) => void;
}
const JnySegmentTrain = ({
  segment,
  onTrainClick,
  className,
  detail,
}: Props) => {
  return (
    <div onClick={onTrainClick} className={className}>
      <TrainInfo>
        <TrainMargin>
          <span>
            {segment.train.name}{' '}
            {segment.plannedSequence && (
              <PlannedType plannedSequence={segment.plannedSequence} />
            )}
          </span>
        </TrainMargin>
        <Destination>
          {segment.finalDestination}
          <DetailsLink
            train={segment.train}
            stationId={segment.segmentStart.id}
            initialDeparture={segment.departure.scheduledTime}
          />
        </Destination>
        {segment.auslastung && (
          <AuslastungsDisplay auslastung={segment.auslastung} />
        )}
      </TrainInfo>
      {detail && (
        <>
          {segment.departure.reihung && segment.train.number && (
            <StyledReihung
              trainNumber={segment.train.number}
              currentStation={segment.segmentStart.title}
              scheduledDeparture={segment.departure.scheduledTime}
            />
          )}
          <StopList stops={segment.stops} />
        </>
      )}
    </div>
  );
};

export default JnySegmentTrain;
