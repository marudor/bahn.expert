import { additionalCss, cancelledCss } from 'client/util/cssUtils';
import { useContext } from 'react';
import CheckInLink from 'client/Common/Components/CheckInLink';
import DetailMessages from '../Messages/Detail';
import DetailsContext from './DetailsContext';
import Messages from './Messages';
import Platform from 'client/Common/Components/Platform';
import Reihung from '../Reihung';
import StationLink from 'client/Common/Components/StationLink';
import styled, { css } from 'styled-components/macro';
import Time from 'client/Common/Components/Time';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const Wrap = styled.div<{ isPast?: boolean }>`
  padding-left: 0.5em;
  padding-right: 0.5em;
  display: grid;
  grid-template-columns: 4.8em 1fr max-content;
  grid-gap: 0 0.3em;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'ar t p c' 'dp t p c' 'wr wr wr wr' 'm m m m';
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.text.primary};
  position: relative;
  ${({ isPast, theme }) =>
    isPast &&
    css`
      background-color: ${theme.colors.shadedBackground};
    `}
`;

const ScrollMarker = styled.span`
  position: absolute;
  top: -64px;
`;

const ArrivalTime = styled(Time)`
  grid-area: ar;
`;

const Station = styled.span<{ cancelled?: boolean; additional?: boolean }>`
  grid-area: t;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ additional, cancelled }) => [
    additional && additionalCss,
    cancelled && cancelledCss,
  ]};
`;

const StationName = styled(StationLink)`
  color: inherit;
`;

const CheckIn = styled(CheckInLink)`
  grid-area: c;
`;

const DepartureTime = styled(Time)`
  grid-area: dp;
`;
const StyledPlatform = styled(Platform)`
  grid-area: p;
`;

const ReihungBox = styled.div`
  font-size: 0.5em;
  grid-area: wr;
  overflow: hidden;
`;

const MessagesBox = styled.div`
  grid-area: m;
  padding-left: 0.75em;
`;

interface Props {
  stop: Route$Stop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
  isPast?: boolean;
}
const Stop = ({ stop, showWR, train, isPast }: Props) => {
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

  return (
    <Wrap data-testid={stop.station.id} isPast={isPast}>
      <ScrollMarker id={stop.station.id} />
      {stop.arrival && (
        <ArrivalTime
          cancelled={stop.arrival.cancelled}
          oneLine
          real={stop.arrival.time}
          delay={stop.arrival.delay}
        />
      )}
      <Station cancelled={stop.cancelled} additional={stop.additional}>
        <StationName stationName={stop.station.title} urlPrefix={urlPrefix} />
      </Station>
      {train && (
        <CheckIn
          station={stop.station}
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
      <ReihungBox>
        {showWR?.number && depOrArrival && (
          <Reihung
            trainNumber={showWR.number}
            currentStation={stop.station.title}
            scheduledDeparture={depOrArrival.scheduledTime}
            loadHidden={!depOrArrival?.reihung}
          />
        )}
      </ReihungBox>
      <MessagesBox>
        {stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
        <Messages messages={stop.messages} />
      </MessagesBox>
    </Wrap>
  );
};

export default Stop;
