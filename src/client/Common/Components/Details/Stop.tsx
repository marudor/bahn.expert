import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { CoachSequence } from '../CoachSequence/CoachSequence';
import { DetailMessages } from '../Messages/Detail';
import { Messages } from './Messages';
import { Platform } from '@/client/Common/Components/Platform';
import { Stack, styled } from '@mui/material';
import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';
import { themeMixins } from '@/client/Themes/mixins';
import { Time } from '@/client/Common/Components/Time';
import { TravelsWith } from '@/client/Common/Components/Details/TravelsWith';
import { TravelynxLink } from '@/client/Common/Components/CheckInLink/TravelynxLink';
import { useCallback, useMemo } from 'react';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import type { FC, MouseEvent } from 'react';
import type { ParsedProduct } from '@/types/HAFAS';
import type { RouteStop } from '@/types/routing';

const ArrivalTime = styled(Time)`
  grid-area: ar;
`;

const DepartureTime = styled(Time)`
  grid-area: dp;
`;

const StopName = styled('span')<{ stop: RouteStop }>(
  {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '> a': {
      color: 'inherit',
    },
  },
  ({ theme, stop: { additional } }) =>
    additional && themeMixins.additional(theme),
  ({ theme, stop: { cancelled } }) => cancelled && themeMixins.cancelled(theme),
);

const ScrollMarker = styled('div')`
  position: absolute;
  top: -64px;
`;

const ArrivalPlatform = styled(Platform)`
  grid-area: arrP;
`;

const DeparturePlatform = styled(Platform)`
  grid-area: depP;
`;

const CoachSequenceContainer = styled('div')`
  grid-area: wr;
  font-size: 0.5em;
  overflow: hidden;
`;

const MessageContainer = styled('div')`
  grid-area: m;
  padding-left: 1em;
`;

const StyledTravelynxLink = styled(TravelynxLink)`
  grid-area: c;
`;

const StyledOccupancy = styled(AuslastungsDisplay)`
  grid-area: o;
`;

const Container = styled('div')<{
  past?: boolean;
  hasOccupancy: boolean;
  samePlatform: boolean;
}>(
  ({ theme, hasOccupancy, samePlatform }) => ({
    padding: '.1em .3em',
    display: 'grid',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr',
    gridTemplateAreas: `"ar t ${samePlatform ? 'depP' : 'arrP'} c" "dp ${
      hasOccupancy ? 'o' : 't'
    } depP c" "tw tw tw tw" "wr wr wr wr" "m m m m"`,
    alignItems: 'center',
    borderBottom: `1px solid ${theme.vars.palette.text.primary}`,
    position: 'relative',
    gridTemplateColumns: `4.8em 1fr max-content`,
  }),
  ({ theme, past }) =>
    past && { backgroundColor: theme.vars.palette.common.shadedBackground },
);

interface Props {
  stop: RouteStop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
  isPast?: boolean;
  initialDepartureDate?: Date;
  onStopClick?: (stop: RouteStop) => void;
  doNotRenderOccupancy?: boolean;
  lastArrivalEva?: string;
}
export const Stop: FC<Props> = ({
  stop,
  showWR,
  train,
  isPast,
  initialDepartureDate,
  onStopClick,
  doNotRenderOccupancy,
  lastArrivalEva,
}) => {
  const { urlPrefix, additionalInformation } = useDetails();
  const occupancy = useMemo(
    () =>
      additionalInformation?.occupancy[stop.station.evaNumber] ||
      stop.auslastung,
    [stop, additionalInformation],
  );
  const depOrArrival = stop.departure || stop.arrival;

  const [platforms, samePlatform] = useMemo(() => {
    const platforms = {
      arrival: {
        real: stop.arrival?.platform,
        scheduled: stop.arrival?.scheduledPlatform,
        cancelled: stop.arrival?.cancelled,
      },
      departure: {
        real: stop.departure?.platform || stop.arrival?.platform,
        scheduled:
          stop.departure?.scheduledPlatform || stop.arrival?.scheduledPlatform,
        cancelled: stop.departure?.cancelled,
      },
    };
    return [
      platforms,
      platforms.arrival.scheduled === platforms.departure.scheduled &&
        platforms.arrival.real === platforms.departure.real,
    ];
  }, [stop.arrival, stop.departure]);

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
      data-testid={stop.station.evaNumber}
      onClick={onClick}
      samePlatform={samePlatform}
    >
      <ScrollMarker id={stop.station.evaNumber} />
      {stop.arrival && (
        <ArrivalTime
          isPlan={stop.arrival.isPlan}
          cancelled={stop.arrival.cancelled}
          real={stop.arrival.time}
          delay={stop.arrival.delay}
          isRealTime={stop.arrival.isRealTime}
        />
      )}
      <StopName stop={stop}>
        <StopPlaceLink stopPlace={stop.station} urlPrefix={urlPrefix} />
      </StopName>
      {!doNotRenderOccupancy && occupancy && (
        <StyledOccupancy oneLine auslastung={occupancy} />
      )}
      {train && (
        <StyledTravelynxLink
          evaNumber={stop.station.evaNumber}
          train={train}
          departure={stop.departure}
          arrival={stop.arrival}
        />
      )}
      {stop.departure && (
        <DepartureTime
          cancelled={stop.departure.cancelled}
          real={stop.departure.time}
          delay={stop.departure.delay}
          isRealTime={stop.departure.isRealTime}
          isPlan={stop.departure.isPlan}
        />
      )}
      <DeparturePlatform {...platforms.departure} />
      {!samePlatform && <ArrivalPlatform {...platforms.arrival} />}
      <Stack gridArea="tw" paddingLeft={1}>
        <TravelsWith
          stopEva={stop.station.evaNumber}
          joinsWith={stop.joinsWith}
          splitsWith={stop.splitsWith}
        />
      </Stack>
      {/* {stop.messages && <div>{stop.messages.map(m => m.txtN)}</div>} */}
      <CoachSequenceContainer>
        {showWR?.number && depOrArrival && (
          <CoachSequence
            trainNumber={showWR.number}
            trainCategory={showWR.type}
            currentEvaNumber={stop.station.evaNumber}
            scheduledDeparture={depOrArrival.scheduledTime}
            initialDeparture={initialDepartureDate}
            lastArrivalEva={lastArrivalEva}
            administration={train?.admin}
            loadHidden={!depOrArrival?.reihung}
          />
        )}
      </CoachSequenceContainer>
      <MessageContainer>
        {stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
        <Messages messages={stop.messages} />
      </MessageContainer>
    </Container>
  );
};
