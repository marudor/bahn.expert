import 'leaflet/dist/leaflet.css';
import { Map, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { ParsedJourneyGeoPosResponse } from 'types/HAFAS/JourneyGeoPos';
import axios from 'axios';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

L.Marker.prototype.options.icon = DefaultIcon;

async function fetchPositions() {
  const result: ParsedJourneyGeoPosResponse = (
    await axios.post(
      '/api/hafas/v1/journeyGeoPos',
      {
        jnyFltrL: [
          {
            mode: 'EXC',
            type: 'PROD',
            value: '1016',
          },
        ],
        ring: {
          cCrd: {
            x: 9997434,
            y: 53557110,
          },
          maxDist: 1000000,
        },
        onlyRT: true,
      },
      {
        params: {
          profile: 'oebb',
        },
      }
    )
  ).data;

  return result;
}

const Positions = () => {
  const [positions, setPositions] = useState<
    ParsedJourneyGeoPosResponse | undefined
  >();

  useEffect(() => {
    const fetchPos = () => fetchPositions().then(r => setPositions(r));

    fetchPos();

    const interval = setInterval(fetchPos, 15000);

    return () => clearInterval(interval);
  }, []);

  if (positions) {
    return (
      <>
        {positions.map(p => (
          <Marker key={p.jid} position={[p.position.lat, p.position.lng]}>
            <Tooltip permanent>{p.train.name}</Tooltip>
          </Marker>
        ))}
      </>
    );
  }

  return null;
};

const attribution =
  '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> and OpenStreetMap';

const TrainMap = () => {
  return (
    <>
      <Map
        style={{ flex: 1 }}
        viewport={{
          center: [50.954032, 9.955472],
          zoom: 7,
        }}
      >
        <TileLayer
          attribution={attribution}
          url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
        <TileLayer url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png" />
        <Positions />
      </Map>
    </>
  );
};

export default TrainMap;
