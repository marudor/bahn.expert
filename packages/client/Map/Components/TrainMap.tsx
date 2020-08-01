import 'leaflet/dist/leaflet.css';
import { ActivePolyline } from 'client/Map/Components/ActivePolyline';
import { Map, TileLayer, Viewport } from 'react-leaflet';
import { MapContainer } from 'client/Map/container/MapContainer';
import { MapSettings } from 'client/Map/Components/MapSettings';
import { Positions } from 'client/Map/Components/Positions';
import { useQuery } from 'client/Common/hooks/useQuery';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import styled from 'styled-components';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultViewport: Viewport = {
  center: [50.954032, 9.955472],
  zoom: 7,
};
const attribution =
  '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> and OpenStreetMap';

const FlexMap = styled<any>(Map)`
  flex: 1;
`;

export const TrainMap = () => {
  const query = useQuery();
  const { setActiveJourney } = MapContainer.useContainer();

  return (
    <FlexMap
      onClick={() => setActiveJourney(undefined)}
      viewport={defaultViewport}
    >
      {!query.noTiles && (
        <>
          <TileLayer
            attribution={attribution}
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
          <TileLayer url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png" />
        </>
      )}
      <Positions />
      <MapSettings />
      <ActivePolyline />
    </FlexMap>
  );
};

// eslint-disable-next-line import/no-default-export
export default TrainMap;
