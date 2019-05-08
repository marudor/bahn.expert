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
} from 'Abfahrten/actions/config';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React, { ChangeEvent } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

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

type Props = ReduxProps & WithStyles<typeof styles>;

class SettingsModal extends React.PureComponent<Props> {
  handleCheckedChange = (fn: (b: boolean) => any) => (
    e: ChangeEvent<HTMLInputElement>
  ) => fn(e.currentTarget.checked);
  handleNumberSelectChange = (fn: (s: any) => any) => (
    e: ChangeEvent<HTMLSelectElement>
  ) => fn(Number.parseInt(e.currentTarget.value, 10));
  handleSelectChange = (fn: (s: any) => any) => (
    e: ChangeEvent<HTMLSelectElement>
  ) => fn(e.currentTarget.value);
  handleNumberValueChange = (fn: (n: number) => any) => (
    e: ChangeEvent<HTMLInputElement>
  ) => fn(Number.parseInt(e.currentTarget.value, 10));
  render() {
    const {
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
      classes,
      autoUpdate,
      setAutoUpdate,
      setLookbehind,
      lookbehind,
    } = this.props;

    return (
      <Dialog maxWidth="md" fullWidth open={open} onClose={closeSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent className={classes.main}>
          <FormControlLabel
            control={
              <NativeSelect
                value={checkIn}
                name="checkIn"
                onChange={this.handleNumberSelectChange(setCheckIn)}
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
                onChange={this.handleNumberValueChange(setAutoUpdate)}
              />
            }
            label="AutoUpdate in Sekunden"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showSupersededMessages}
                value="showSupersededMessagesConfig"
                onChange={this.handleCheckedChange(setShowSupersededMessages)}
              />
            }
            label="Obsolete Messages"
          />
          <FormControlLabel
            control={
              <Switch
                checked={time}
                value="timeConfig"
                onChange={this.handleCheckedChange(setTime)}
              />
            }
            label="Neue Ankunft bei Verspätung"
          />
          <FormControlLabel
            control={
              <Switch
                checked={zoomReihung}
                value="zoomReihungConfig"
                onChange={this.handleCheckedChange(setZoomReihung)}
              />
            }
            label="Reihung maximal groß"
          />
          <FormControlLabel
            control={
              <Switch
                checked={lineAndNumber}
                value="lineAndNumberConfig"
                onChange={this.handleCheckedChange(setLineAndNumber)}
              />
            }
            label="Zeige Linie und Zugnummer"
          />
          <FormControlLabel
            control={
              <Switch
                checked={fahrzeugGruppe}
                value="fahrzeugGruppeConfig"
                onChange={this.handleCheckedChange(setFahrzeugGruppe)}
              />
            }
            label="Zeige Fahrzeuggruppen Name"
          />
          <FormControlLabel
            control={
              <NativeSelect
                value={lookahead}
                name="lookahead"
                onChange={this.handleSelectChange(setLookahead)}
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
            control={
              <NativeSelect
                value={lookbehind}
                name="lookbehind"
                onChange={this.handleSelectChange(setLookbehind)}
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
            control={
              <NativeSelect
                value={searchType}
                name="searchType"
                onChange={this.handleNumberSelectChange(setSearchType)}
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
  }
}

export const styles = createStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },

  autoUpdate: {
    width: '3em',
  }
}));

export default connect<StateProps, DispatchProps, void, AbfahrtenState>(
  state => ({
    open: state.config.open,
    ...state.config.config,
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
)(withStyles(styles)(SettingsModal));
