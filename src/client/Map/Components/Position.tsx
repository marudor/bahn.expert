import { Marker, Tooltip } from 'react-leaflet';
import { SingleParsedJourneyGeoPos } from 'types/HAFAS/JourneyGeoPos';
import MapContainer from 'client/Map/container/MapContainer';
import React, { useCallback } from 'react';

interface Props {
  journey: SingleParsedJourneyGeoPos;
}
const Position = ({ journey }: Props) => {
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

export default Position;
