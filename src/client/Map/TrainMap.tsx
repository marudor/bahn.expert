import 'leaflet/dist/leaflet.css';
import { AllowedHafasProfile } from 'types/HAFAS';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Map, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { ParsedJourneyGeoPosResponse } from 'types/HAFAS/JourneyGeoPos';
import axios from 'axios';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Settings from '@material-ui/icons/Settings';
import useStyles from './TrainMap.style';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FetchPositionOptions {
  includeFV?: boolean;
  includeNV?: boolean;
  profile?: AllowedHafasProfile;
  onlyRT?: boolean;
}
async function fetchPositions({
  includeFV = true,
  includeNV = false,
  profile = AllowedHafasProfile.oebb,
  onlyRT = true,
}: FetchPositionOptions = {}) {
  const result: ParsedJourneyGeoPosResponse = (
    await axios.post(
      '/api/hafas/v1/journeyGeoPos',
      {
        jnyFltrL:
          includeFV && includeNV
            ? undefined
            : [
                {
                  mode: includeFV ? 'INC' : 'EXC',
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
        onlyRT,
      },
      {
        params: {
          profile,
        },
      }
    )
  ).data;

  return result;
}

interface Props {
  includeNV: boolean;
  includeFV: boolean;
  onlyRT: boolean;
  profile: AllowedHafasProfile;
}
const Positions = (props: Props) => {
  const [positions, setPositions] = useState<
    ParsedJourneyGeoPosResponse | undefined
  >();

  useEffect(() => {
    const fetchPos = () => fetchPositions(props).then(r => setPositions(r));

    fetchPos();

    const interval = setInterval(fetchPos, 15000);

    return () => clearInterval(interval);
  }, [props]);

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
  const classes = useStyles();
  const [includeFV, setIncludeFV] = useState(true);
  const [includeNV, setIncludeNV] = useState(false);
  const [onlyRT, setOnlyRT] = useState(true);
  const [profile, setProfile] = useState<AllowedHafasProfile>(
    AllowedHafasProfile.oebb
  );
  const toggle = useCallback(setFn => setFn((old: boolean) => !old), []);
  const [open, setOpen] = useState(true);
  const toggleOpen = useMemo(() => toggle(setOpen), [toggle]);
  const toggleIncludeFV = useMemo(() => toggle(setIncludeFV), [toggle]);
  const toggleIncludeNV = useMemo(() => toggle(setIncludeNV), [toggle]);
  const toggleOnlyRT = useMemo(() => toggle(setOnlyRT), [toggle]);

  return (
    <>
      <Map
        className={classes.map}
        style={{ flex: 1 }}
        viewport={{
          center: [50.954032, 9.955472],
          zoom: 7,
        }}
      >
        <Settings className={classes.settings} onClick={toggleOpen} />
        <Dialog maxWidth="md" open={open} onClose={toggleOpen}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Switch checked={includeFV} onChange={toggleIncludeFV} />
              }
              label="Fernverkehr"
            />
            <FormControlLabel
              control={
                <Switch checked={includeNV} onChange={toggleIncludeNV} />
              }
              label="Nahverkehr"
            />
            <FormControlLabel
              control={<Switch checked={onlyRT} onChange={toggleOnlyRT} />}
              label="Nur Echtzeit"
            />
          </DialogContent>
        </Dialog>
        <TileLayer
          attribution={attribution}
          url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
        <TileLayer url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png" />
        <Positions
          includeFV={includeFV}
          includeNV={includeNV}
          onlyRT={onlyRT}
          profile={profile}
        />
      </Map>
    </>
  );
};

export default TrainMap;
