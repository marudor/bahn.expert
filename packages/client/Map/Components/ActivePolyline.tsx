import { Marker, Polyline, Tooltip } from 'react-leaflet';
import { useMapProvider } from 'client/Map/provider/MapProvider';
import { useMemo } from 'react';
import type { FC } from 'react';
// @ts-expect-error TS doesnt know png
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-expect-error TS doesnt know png
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

export const ActivePolyline: FC = () => {
  const { activePolyline, activeJourney } = useMapProvider();
  const trainIcon = useMemo(
    () =>
      L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        className: 'mapIcon',
      }),
    [],
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
