import { Marker, Polyline, Tooltip } from 'react-leaflet';
import MapContainer from 'client/Map/container/MapContainer';
import React, { useMemo } from 'react';
import useStyles from './ActivePolyline.style';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const ActivePolyline = () => {
  const { activePolyline, activeJourney } = MapContainer.useContainer();
  const classes = useStyles();
  const trainIcon = useMemo(
    () =>
      L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        className: classes.icon,
      }),
    [classes.icon]
  );

  if (!activePolyline || !activeJourney) return null;

  return (
    <>
      <Polyline color="green" positions={activePolyline.points} />
      {activePolyline.locations.map((l) => (
        <Marker
          icon={trainIcon}
          key={l.id}
          position={[l.coordinates.lat, l.coordinates.lng]}
        >
          <Tooltip permanent>{l.title}</Tooltip>
        </Marker>
      ))}
    </>
  );
};

export default ActivePolyline;
