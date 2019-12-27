import './style.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import 'ol/ol.css';

import { OlMap } from 'openlayers-react';
import { ParsedJourneyGeoPosResponse } from 'types/HAFAS/JourneyGeoPos';
import axios from 'axios';
import createMapboxStreetsV6Style from './mapbox';
import LayerSwitcher from 'ol-layerswitcher';
import React, { useEffect, useState } from 'react';

import {
  Attribution as AttributionControl,
  Rotate as RotateControl,
  Zoom as ZoomControl,
} from 'ol/control';
import {
  Circle as CircleStyle,
  Fill as FillStyle,
  Stroke as StrokeStyle,
  Style,
  Text as TextStyle,
} from 'ol/style';
import { Feature, View as OlView } from 'ol';
import {
  Group,
  Tile as TileLayer,
  Vector as VectorLayer,
  VectorTile as VectorTileLayer,
} from 'ol/layer';
import { transform } from 'ol/proj';
import {
  Vector as VectorSource,
  VectorTile as VectorTileSource,
  XYZ as XYZSource,
} from 'ol/source';
import Collection from 'ol/Collection';
import MVT from 'ol/format/MVT';
import Point from 'ol/geom/Point';

const vectorSource = new VectorSource();

const vectorLayer = new VectorLayer({
  source: vectorSource,
  zIndex: 10,
  type: 'features',
  title: 'Trains',
});

const controls = new Collection();

controls.push(new LayerSwitcher());
controls.push(new RotateControl());
controls.push(new AttributionControl());
controls.push(new ZoomControl());

const key =
  'pk.eyJ1IjoicGV0YWJ5dGVib3kiLCJhIjoiY2lxMjU5dmJ5MDAzZmk1bmttNGVycW9jciJ9.WojZvYg5pgqA51efvkcJnw';

const mapOptions = {
  controls,
  layers: [
    vectorLayer,
    new Group({
      title: 'OpenRailwayMap',
      layers: [
        new TileLayer({
          title: 'Signalling',
          visible: false,
          source: new XYZSource({
            url: 'https://a.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.webp',
            attributions:
              '<a href="http://www.openrailwaymap.org/">© OpenRailwayMap</a>',
          }),
          zIndex: 4,
        }),
        new TileLayer({
          title: 'Max speed',
          visible: false,
          source: new XYZSource({
            url: 'https://a.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.webp',
            attributions:
              '<a href="http://www.openrailwaymap.org/">© OpenRailwayMap</a>',
          }),
          zIndex: 3,
        }),
        new TileLayer({
          title: 'Infrastructure',
          source: new XYZSource({
            url: 'https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.webp',
            attributions:
              '<a href="http://www.openrailwaymap.org/">© OpenRailwayMap</a>',
          }),
          zIndex: 2,
        }),
      ],
    }),
    new Group({
      title: 'Base maps',
      layers: [
        new VectorTileLayer({
          title: 'Mapbox Vector',
          type: 'base',
          visible: false,
          declutter: true,
          source: new VectorTileSource({
            attributions:
              '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>' +
              '<a href="https://www.mapbox.com/map-feedback/">© Mapbox</a> ',
            format: new MVT(),
            url: `${'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
              '{z}/{x}/{y}.vector.pbf?access_token='}${key}`,
          }),
          style: createMapboxStreetsV6Style(),
          zIndex: 1,
        }),
        new TileLayer({
          title: 'Carto',
          type: 'base',
          source: new XYZSource({
            url:
              'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.webp',
            attributions:
              '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a> <a href="https://carto.com/attribution">© CARTO</a>',
          }),
          zIndex: 1,
        }),
      ],
    }),
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
