import { CheckInType, StationSearchType } from 'Common/config';
import {
  closeSettings,
  setAutoUpdate,
  setCheckIn,
  setFahrzeugGruppe,
  setLineAndNumber,
  setLookahead,
  setLookbehind,
  setSearchType,
  setShowSupersededMessages,
  setTime,
  setZoomReihung,
} from 'Abfahrten/actions/abfahrtenConfig';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAbfahrtenSelector } from 'useSelector';
import Cookies from 'universal-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React, { ChangeEvent, useCallback } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import useCookies from 'Common/useCookies';
import useStyles from './SettingsModal.style';

const SettingsModal = () => {
  const {
    checkIn,
    fahrzeugGruppe,
    lineAndNumber,
    lookahead,
    open,
    searchType,
    showSupersededMessages,
    time,
    zoomReihung,
    autoUpdate,
    lookbehind,
  } = useAbfahrtenSelector(
    state => ({
      open: state.abfahrtenConfig.open,
      ...state.abfahrtenConfig.config,
    }),
    shallowEqual
  );
  const cookies = useCookies();
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleCheckedChange = useCallback(
    (fn: (b: boolean, cookies: Cookies) => any) => (
      e: ChangeEvent<HTMLInputElement>
    ) => dispatch(fn(e.currentTarget.checked, cookies)),
    [cookies, dispatch]
  );
  const handleNumberSelectChange = useCallback(
    (fn: (s: any, cookies: Cookies) => any) => (
      e: ChangeEvent<HTMLSelectElement>
    ) => dispatch(fn(Number.parseInt(e.currentTarget.value, 10), cookies)),
    [cookies, dispatch]
  );
  const handleSelectChange = useCallback(
    (fn: (s: any, cookies: Cookies) => any) => (
      e: ChangeEvent<HTMLSelectElement>
    ) => dispatch(fn(e.currentTarget.value, cookies)),
    [cookies, dispatch]
  );
  const handleNumberValueChange = useCallback(
    (fn: (n: number, cookies: Cookies) => any) => (
      e: ChangeEvent<HTMLInputElement>
    ) => dispatch(fn(Number.parseInt(e.currentTarget.value, 10), cookies)),
    [cookies, dispatch]
  );

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={() => dispatch(closeSettings())}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent className={classes.main}>
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              value={checkIn}
              name="checkIn"
              onChange={handleNumberSelectChange(setCheckIn)}
            >
              <option value={CheckInType.None}>Kein</option>
              <option value={CheckInType.Travelynx}>travelynx.de</option>
              <option value={CheckInType.Traewelling}>traewelling.de</option>
              <option value={CheckInType.Both}>beide</option>
            </NativeSelect>
          }
          label="Traewelling Link"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <TextField
              className={classes.autoUpdate}
              value={autoUpdate}
              type="number"
              inputProps={{
                min: 0,
                max: 9999,
                step: 30,
              }}
              name="autoUpdate"
              onChange={handleNumberValueChange(setAutoUpdate)}
            />
          }
          label="AutoUpdate in Sekunden"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              checked={showSupersededMessages}
              value="showSupersededMessagesConfig"
              onChange={handleCheckedChange(setShowSupersededMessages)}
            />
          }
          label="Obsolete Messages"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              checked={time}
              value="timeConfig"
              onChange={handleCheckedChange(setTime)}
            />
          }
          label="Neue Ankunft bei Verspätung"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              checked={zoomReihung}
              value="zoomReihungConfig"
              onChange={handleCheckedChange(setZoomReihung)}
            />
          }
          label="Reihung maximal groß"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              data-testid="lineAndNumberConfig"
              checked={lineAndNumber}
              value="lineAndNumberConfig"
              onChange={handleCheckedChange(setLineAndNumber)}
            />
          }
          label="Zeige Linie und Zugnummer"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              data-testid="fahrzeugGruppeConfig"
              checked={fahrzeugGruppe}
              value="fahrzeugGruppeConfig"
              onChange={handleCheckedChange(setFahrzeugGruppe)}
            />
          }
          label="Zeige Fahrzeuggruppen Name"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              value={lookahead}
              name="lookahead"
              onChange={handleSelectChange(setLookahead)}
            >
              <option value="60">60</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="180">180</option>
              <option value="240">240</option>
              <option value="300">300</option>
            </NativeSelect>
          }
          label="Lookahead in Minuten"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              value={lookbehind}
              name="lookbehind"
              onChange={handleSelectChange(setLookbehind)}
            >
              <option value="0">0</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
            </NativeSelect>
          }
          label="Lookbehind in Minuten"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              value={searchType}
              name="searchType"
              onChange={handleNumberSelectChange(setSearchType)}
            >
              <option value={StationSearchType.Favendo}>Favendo</option>
              <option value={StationSearchType.FavendoStationsData}>
                Favendo + Stationsdaten
              </option>
              <option value={StationSearchType.OpenData}>Open Data</option>
              <option value={StationSearchType.OpenDataOffline}>
                Open Data Offline
              </option>
              <option value={StationSearchType.HAFAS}>HAFAS</option>
              <option value={StationSearchType.DBNavgiator}>
                DB Navigator
              </option>
              <option value={StationSearchType.StationsData}>
                Open Data Stationsdaten
              </option>
            </NativeSelect>
          }
          label="API zur Stationssuche"
        />
        {/* <BrowserstackThanks /> */}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
