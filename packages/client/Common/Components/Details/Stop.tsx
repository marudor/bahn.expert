import { DetailMessages } from '../Messages/Detail';
import { DetailsContext } from './DetailsContext';
import { Messages } from './Messages';
import { Platform } from 'client/Common/Components/Platform';
import { Reihung } from '../Reihung';
import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import { StationLink } from 'client/Common/Components/StationLink';
import { Time } from 'client/Common/Components/Time';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useCallback, useContext } from 'react';
import styled from '@emotion/styled';
import type { FC, MouseEvent } from 'react';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const ArrivalTime = styled(Time)`
  grid-area: ar;
`;

const DepartureTime = styled(Time)`
  grid-area: dp;
`;

const StopName = styled.span<{ stop: Route$Stop }>(
  {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '> a': {
      color: 'inherit',
    },
  },
  ({ theme, stop: { additional } }) => additional && theme.mixins.additional,
  ({ theme, stop: { cancelled } }) => cancelled && theme.mixins.cancelled,
);

const ScrollMarker = styled.div`
  position: absolute;
  top: -64px;
`;

const StyledPlatform = styled(Platform)`
  grid-area: p;
`;

const ReihungContainer = styled.div`
  grid-area: wr;
  font-size: 0.5em;
  overflow: hidden;
`;

const MessageContainer = styled.div`
  grid-area: m;
  padding-left: 0.75em;
`;

const StyledTravelynxLink = styled(TravelynxLink)`
  grid-area: c;
`;

const Container = styled.div<{ past?: boolean; hasOccupancy?: boolean }>(
  ({ theme, hasOccupancy }) => ({
    padding: '0 .5em',
    display: 'grid',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas:
      '"ar o1 t p c" "dp o2 t p c" "wr wr wr wr wr" "m m m m m"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    position: 'relative',
    gridTemplateColumns: `4.8em ${
      hasOccupancy ? '1.7em' : '0'
    } 1fr max-content`,
  }),
  ({ theme, past }) =>
    past && { backgroundColor: theme.colors.shadedBackground },
);

const Occupancy1 = styled.span`
  grid-area: o1;
`;
const Occupancy2 = styled.span`
  grid-area: o2;
`;

interface Props {
  stop: Route$Stop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
  isPast?: boolean;
  hasOccupancy?: boolean;
  doNotRenderOccupancy?: boolean;
  initialDepartureDate?: Date;
  onStopClick?: (stop: Route$Stop) => void;
}
export const Stop: FC<Props> = ({
  stop,
  showWR,
  train,
  isPast,
  hasOccupancy = false,
  doNotRenderOccupancy,
  initialDepartureDate,
  onStopClick,
}) => {
  const { urlPrefix } = useContext(DetailsContext);
  const depOrArrival = stop.departure || stop.arrival;
  const platforms = stop.departure
    ? {
        real: stop.departure.platform,
        scheduled: stop.departure.scheduledPlatform,
      }
    : stop.arrival
    ? {
        real: stop.arrival.platform,
        scheduled: stop.arrival.scheduledPlatform,
      }
    : {};

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onStopClick?.(stop);
    },
    [stop, onStopClick],
  );

  return (
    <Container
      past={isPast}
      hasOccupancy={hasOccupancy}
      data-testid={stop.station.id}
      onClick={onClick}
    >
      <ScrollMarker id={stop.station.id} />
      {stop.arrival && (
        <ArrivalTime
          cancelled={stop.arrival.cancelled}
          oneLine
          real={stop.arrival.time}
          delay={stop.arrival.delay}
        />
      )}
      <StopName stop={stop}>
        <StationLink stationName={stop.station.title} urlPrefix={urlPrefix} />
      </StopName>
      {stop.auslastung && !doNotRenderOccupancy && (
        <>
          <Occupancy1 data-testid="occupancy1">
            1
            <SingleAuslastungsDisplay auslastung={stop.auslastung.first} />
          </Occupancy1>
          <Occupancy2 data-testid="occupancy2">
            2
            <SingleAuslastungsDisplay auslastung={stop.auslastung.second} />
          </Occupancy2>
        </>
      )}
      {train && (
        <StyledTravelynxLink
          evaNumber={stop.station.id}
          train={train}
          departure={stop.departure}
          arrival={stop.arrival}
        />
      )}
      {stop.departure && (
        <DepartureTime
          cancelled={stop.departure.cancelled}
          oneLine
          real={stop.departure.time}
          delay={stop.departure.delay}
        />
      )}
      {/* {stop.messages && <div>{stop.messages.map(m => m.txtN)}</div>} */}
      <StyledPlatform {...platforms} />
      <ReihungContainer>
        {showWR?.number && depOrArrival && (
          <Reihung
            trainNumber={showWR.number}
            currentEvaNumber={stop.station.id}
            scheduledDeparture={depOrArrival.scheduledTime}
            initialDeparture={initialDepartureDate}
            loadHidden={!depOrArrival?.reihung}
          />
        )}
      </ReihungContainer>
      <MessageContainer>
        {stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
        <Messages messages={stop.messages} />
      </MessageContainer>
    </Container>
  );
};
