import './style.css';
import 'ol/ol.css';

import { OlMap } from 'openlayers-react';
import { ParsedJourneyGeoPosResponse } from 'types/HAFAS/JourneyGeoPos';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import {
  Circle as CircleStyle,
  Fill as FillStyle,
  Stroke as StrokeStyle,
  Style,
  Text as TextStyle,
} from 'ol/style';
import { defaults as defaultControls } from 'ol/control';
import { Feature, View as OlView } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { transform } from 'ol/proj';
import { Vector as VectorSource, XYZ as XYZSource } from 'ol/source';
import Point from 'ol/geom/Point';

const vectorSource = new VectorSource();

const vectorLayer = new VectorLayer({
  source: vectorSource,
  zIndex: 3,
});

const mapOptions = {
  controls: defaultControls(),
  layers: [
    new TileLayer({
      source: new XYZSource({
        url:
          'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.webp',
        attributions:
          '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a> | <a href="https://carto.com/attribution">© CARTO</a>',
      }),
    }),
    new TileLayer({
      source: new XYZSource({
        url: 'https://a.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.webp',
        attributions:
          ' | <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>',
      }),
      zIndex: 2,
    }),
    vectorLayer,
  ],
  view: new OlView({
    center: transform([9.955472, 50.954032], 'EPSG:4326', 'EPSG:3857'),
    zoom: 7,
  }),
};

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
    vectorSource.clear();
    let i = 0;

    vectorSource.addFeatures(
      positions.map(p => {
        p.train.name = p.train.name.replace(/\s*([0-9]+)/, '\n$1');
        const feat = new Feature({
          geometry: new Point(
            transform(
              [p.position.lng, p.position.lat],
              'EPSG:4326',
              'EPSG:3857'
            )
          ),
        });

        feat.setStyle(
          new Style({
            image: new CircleStyle({
              radius:
                15 +
                p.train.name
                  .split('\n')
                  .slice(1)
                  .join(' ').length *
                  3,
              fill: new FillStyle({ color: 'white' }),
              stroke: new StrokeStyle({
                color: 'black',
                width: 1,
              }),
            }),
            text: new TextStyle({
              font: 'bold 14px sans-serif',
              text: p.train.name,
              fill: new FillStyle({ color: '#dd0000' }),
            }),
            zIndex: 5 + i,
          })
        );
        i += 1;

        feat.setId(p.jid);

        return feat;
      })
    );
  }

  return null;
};

const TrainMap = () => {
  return (
    <div>
      <OlMap initialMapOptions={mapOptions} mapId={'MyMap'}>
        <Positions />
      </OlMap>
    </div>
  );
};

export default TrainMap;
