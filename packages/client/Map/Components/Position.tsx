import { Marker, Tooltip } from 'react-leaflet';
import { useCallback, useMemo } from 'react';
import { useMapProvider } from 'client/Map/provider/MapProvider';
import type { FC } from 'react';
import type { LeafletMouseEvent } from 'leaflet';
import type { SingleParsedJourneyGeoPos } from 'types/HAFAS/JourneyGeoPos';

interface Props {
  journey: SingleParsedJourneyGeoPos;
}
export const Position: FC<Props> = ({ journey }) => {
  const { permanent, setActiveJourney, activeJourney } = useMapProvider();

  const setCurrentJourneyActive = useCallback(
    (e: LeafletMouseEvent) => {
      e.originalEvent.stopImmediatePropagation();
      setActiveJourney(journey);
    },
    [journey, setActiveJourney],
  );

  const eventHandlers = useMemo(
    () => ({
      click: setCurrentJourneyActive,
    }),
    [setCurrentJourneyActive],
  );

  return (
    <Marker
      alt={journey.train.name}
      eventHandlers={eventHandlers}
      position={[journey.position.lat, journey.position.lng]}
    >
      <Tooltip permanent={permanent || activeJourney?.jid === journey.jid}>
        {journey.train.name}
        {' -> '}
        {journey.stops[journey.stops.length - 1].station.title}
      </Tooltip>
    </Marker>
  );
};
