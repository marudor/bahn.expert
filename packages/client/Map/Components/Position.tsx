import { MapContainer } from 'client/Map/container/MapContainer';
import { Marker, Tooltip } from 'react-leaflet';
import { useCallback } from 'react';
import type { SingleParsedJourneyGeoPos } from 'types/HAFAS/JourneyGeoPos';

interface Props {
  journey: SingleParsedJourneyGeoPos;
}
export const Position = ({ journey }: Props) => {
  const {
    permanent,
    setActiveJourney,
    activeJourney,
  } = MapContainer.useContainer();

  const setCurrentJourneyActive = useCallback(() => {
    setActiveJourney(journey);
  }, [journey, setActiveJourney]);

  return (
    <Marker
      alt={journey.train.name}
      onClick={setCurrentJourneyActive}
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
