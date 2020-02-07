import { Marker, Polyline, Tooltip } from 'react-leaflet';
import MapContainer from 'client/Map/container/MapContainer';
import React from 'react';

const ActivePolyline = () => {
  const { activePolyline, activeJourney } = MapContainer.useContainer();

  if (!activePolyline || !activeJourney) return null;

  return (
    <>
      <Polyline positions={activePolyline.points} />
      {activePolyline.locations.map(l => (
        <Marker key={l.id} position={[l.coordinates.lat, l.coordinates.lng]}>
          <Tooltip permanent>{l.title}</Tooltip>
        </Marker>
      ))}
    </>
  );
};

export default ActivePolyline;
