import 'leaflet/dist/leaflet.css';
import { ActivePolyline } from 'client/Map/Components/ActivePolyline';
import { makeStyles } from '@material-ui/core';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapSettings } from 'client/Map/Components/MapSettings';
import { Positions } from 'client/Map/Components/Positions';
import { useMapProvider } from 'client/Map/provider/MapProvider';
import { useMemo } from 'react';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { LatLngTuple } from 'leaflet';
// @ts-expect-error TS doesnt know png
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-expect-error TS doesnt know png
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import type { FC } from 'react';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

L.Marker.prototype.options.icon = DefaultIcon;

const center: LatLngTuple = [50.954032, 9.955472];
const zoom = 7;

const attribution =
  '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> and OpenStreetMap';

const useStyles = makeStyles({
  wrap: {
    flex: 1,
  },
});

export const TrainMap: FC = () => {
  const classes = useStyles();
  const query = useQuery();
  const { setActiveJourney } = useMapProvider();

  const whenReady = useMemo(
    () => () => {
      const leafletContainer = document.querySelector('.leaflet-container');
      leafletContainer?.addEventListener('click', () => {
        setActiveJourney(undefined);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MapContainer
      className={classes.wrap}
      center={center}
      zoom={zoom}
      whenReady={whenReady}
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
    </MapContainer>
  );
};

// eslint-disable-next-line import/no-default-export
export default TrainMap;
