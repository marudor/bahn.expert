import { AbfahrtenState } from 'AppState';
import { CheckInType, MarudorConfig, StationSearchType } from 'Common/config';
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
import { connect, ResolveThunks } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React, { ChangeEvent, useCallback } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import useStyles from './SettingsModal.style';

type StateProps = {
  open: boolean;
} & MarudorConfig;

type DispatchProps = ResolveThunks<{
  closeSettings: typeof closeSettings;
  setSearchType: typeof setSearchType;
  setShowSupersededMessages: typeof setShowSupersededMessages;
  setTime: typeof setTime;
  setCheckIn: typeof setCheckIn;
  setZoomReihung: typeof setZoomReihung;
  setLookahead: typeof setLookahead;
  setFahrzeugGruppe: typeof setFahrzeugGruppe;
  setLineAndNumber: typeof setLineAndNumber;
  setAutoUpdate: typeof setAutoUpdate;
  setLookbehind: typeof setLookbehind;
}>;

type ReduxProps = StateProps & DispatchProps;

type Props = ReduxProps;

const SettingsModal = ({
  checkIn,
  closeSettings,
  fahrzeugGruppe,
  lineAndNumber,
  lookahead,
  open,
  searchType,
  setCheckIn,
  setFahrzeugGruppe,
  setLineAndNumber,
  setLookahead,
  setSearchType,
  setShowSupersededMessages,
  setTime,
  setZoomReihung,
  showSupersededMessages,
  time,
  zoomReihung,
  autoUpdate,
  setAutoUpdate,
  setLookbehind,
  lookbehind,
}: Props) => {
  const classes = useStyles();
  const handleCheckedChange = useCallback(
    (fn: (b: boolean) => any) => (e: ChangeEvent<HTMLInputElement>) =>
      fn(e.currentTarget.checked),
    []
  );
  const handleNumberSelectChange = useCallback(
    (fn: (s: any) => any) => (e: ChangeEvent<HTMLSelectElement>) =>
      fn(Number.parseInt(e.currentTarget.value, 10)),
    []
  );
  const handleSelectChange = useCallback(
    (fn: (s: any) => any) => (e: ChangeEvent<HTMLSelectElement>) =>
      fn(e.currentTarget.value),
    []
  );
  const handleNumberValueChange = useCallback(
    (fn: (n: number) => any) => (e: ChangeEvent<HTMLInputElement>) =>
      fn(Number.parseInt(e.currentTarget.value, 10)),
    []
  );

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={closeSettings}>
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
              <option value={StationSearchType.OpenDB}>Open DB</option>
              <option value={StationSearchType.FavendoAndOpenDB}>
                Open DB + Favendo
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

export default connect<StateProps, DispatchProps, void, AbfahrtenState>(
  state => ({
    open: state.abfahrtenConfig.open,
    ...state.abfahrtenConfig.config,
  }),
  {
    closeSettings,
    setTime,
    setSearchType,
    setCheckIn,
    setZoomReihung,
    setShowSupersededMessages,
    setLookahead,
    setLookbehind,
    setFahrzeugGruppe,
    setLineAndNumber,
    setAutoUpdate,
  }
)(SettingsModal);
