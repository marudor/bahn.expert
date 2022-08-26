import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { DetailMessages } from '../Messages/Detail';
import { Messages } from './Messages';
import { Platform } from 'client/Common/Components/Platform';
import { Reihung } from '../Reihung';
import { StationLink } from 'client/Common/Components/StationLink';
import { Time } from 'client/Common/Components/Time';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useCallback, useMemo } from 'react';
import { useDetails } from 'client/Common/provider/DetailsProvider';
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

const StyledOccupancy = styled(AuslastungsDisplay)`
  grid-area: o;
`;

const Container = styled.div<{ past?: boolean; hasOccupancy: boolean }>(
  ({ theme, hasOccupancy }) => ({
    padding: '.1em .5em',
    display: 'grid',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr',
    gridTemplateAreas: `"ar t p c" "dp ${
      hasOccupancy ? 'o' : 't'
    } p c" "wr wr wr wr" "m m m m"`,
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    position: 'relative',
    gridTemplateColumns: `4.8em 1fr max-content`,
  }),
  ({ theme, past }) =>
    past && { backgroundColor: theme.colors.shadedBackground },
);

interface Props {
  stop: Route$Stop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
  isPast?: boolean;
  initialDepartureDate?: Date;
  onStopClick?: (stop: Route$Stop) => void;
  doNotRenderOccupancy?: boolean;
}
export const Stop: FC<Props> = ({
  stop,
  showWR,
  train,
  isPast,
  initialDepartureDate,
  onStopClick,
  doNotRenderOccupancy,
}) => {
  const { urlPrefix, additionalInformation } = useDetails();
  const occupancy = useMemo(
    () => additionalInformation?.occupancy[stop.station.id] || stop.auslastung,
    [stop, additionalInformation],
  );
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
      hasOccupancy={Boolean(occupancy) && !doNotRenderOccupancy}
      past={isPast}
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
      {!doNotRenderOccupancy && occupancy && (
        <StyledOccupancy oneLine auslastung={occupancy} />
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
