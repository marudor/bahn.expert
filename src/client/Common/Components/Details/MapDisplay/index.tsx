import 'leaflet/dist/leaflet.css';
import { Fab, styled } from '@mui/material';
import { type FC, useMemo } from 'react';
import { LocationOff, LocationOn } from '@mui/icons-material';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const MarkerFab = styled(Fab)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

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
  const { polyline, showMarkers, toggleShowMarkers } = useDetails();
  const polylineLocations = useMemo(() => {
    if (!polyline) {
      return undefined;
    }
    if (showMarkers) {
      return polyline.locations;
    }
    return [polyline.locations[0], polyline.locations.at(-1)!];
  }, [polyline, showMarkers]);
  if (!polyline) return null;
  return (
    <StyledMapContainer center={position} zoom={7}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={polyline.points as [number, number][]} />
      {polylineLocations?.map((location, i) => (
        <Marker position={location.coordinates} key={i}>
          <Tooltip direction="auto">
            {location.details?.station.name || location.name}
          </Tooltip>
        </Marker>
      ))}
      <MarkerFab size="small" onClick={toggleShowMarkers}>
        {showMarkers ? <LocationOn /> : <LocationOff />}
      </MarkerFab>
    </StyledMapContainer>
  );
};

// eslint-disable-next-line import/no-default-export
export default MapDisplay;
