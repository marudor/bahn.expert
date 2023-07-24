import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
// @ts-expect-error TS doesn't know png
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-expect-error TS doesn't know png
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import styled from '@emotion/styled';
import type { FC } from 'react';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

L.Marker.prototype.options.icon = DefaultIcon;

const position: [number, number] = [50.878, 10.107];

const StyledMapContainer = styled(MapContainer)`
  height: 100%;
`;

const MapDisplay: FC = () => {
  const { polyline } = useDetails();
  if (!polyline) return null;
  return (
    <StyledMapContainer center={position} zoom={7}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={polyline.points as [number, number][]} />
      {polyline.locations.map((location, i) => (
        <Marker position={location.coordinates} key={i}>
          <Tooltip direction="auto">
            {location.details?.station.name || location.name}
          </Tooltip>
        </Marker>
      ))}
    </StyledMapContainer>
  );
};

// eslint-disable-next-line import/no-default-export
export default MapDisplay;
