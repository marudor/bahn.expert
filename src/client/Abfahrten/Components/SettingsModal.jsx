// @flow
import {
  closeSettings,
  setAutoUpdate,
  setCheckIn,
  setFahrzeugGruppe,
  setLineAndNumber,
  setLookahead,
  setSearchType,
  setShowSupersededMessages,
  setTime,
  setZoomReihung,
} from 'Abfahrten/actions/config';
import { connect } from 'react-redux';
import BrowserstackThanks from './BrowserstackThanks';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState } from 'AppState';

type StateProps = {|
  +open: boolean,
  ...marudorConfig,
|};
type OwnProps = {||};

type DispatchProps = {|
  +closeSettings: typeof closeSettings,
  +setSearchType: typeof setSearchType,
  +setShowSupersededMessages: typeof setShowSupersededMessages,
  +setTime: typeof setTime,
  +setCheckIn: typeof setCheckIn,
  +setZoomReihung: typeof setZoomReihung,
  +setLookahead: typeof setLookahead,
  +setFahrzeugGruppe: typeof setFahrzeugGruppe,
  +setLineAndNumber: typeof setLineAndNumber,
  +setAutoUpdate: typeof setAutoUpdate,
|};

type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

type Props = StyledProps<ReduxProps, typeof styles>;

class SettingsModal extends React.PureComponent<Props> {
  handleCheckedChange = (fn: boolean => any) => (e: SyntheticEvent<HTMLInputElement>) => fn(e.currentTarget.checked);
  handleValueChange = (fn: string => any) => (e: SyntheticEvent<HTMLInputElement>) => fn(e.currentTarget.value);
  handleNumberValueChange = (fn: number => any) => (e: SyntheticEvent<HTMLInputElement>) =>
    fn(Number.parseInt(e.currentTarget.value, 10));
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
    } = this.props;

    return (
      <Dialog maxWidth="md" fullWidth open={open} onClose={closeSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent className={classes.main}>
          <FormControlLabel
            control={
              <NativeSelect value={checkIn} name="checkIn" onChange={this.handleValueChange(setCheckIn)}>
                <option value="">Kein</option>
                <option value="travelynx">travelynx.de</option>
                <option value="traewelling">traewelling.de</option>
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
            control={<Switch checked={time} value="timeConfig" onChange={this.handleCheckedChange(setTime)} />}
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
              <NativeSelect value={lookahead} name="lookahead" onChange={this.handleValueChange(setLookahead)}>
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
              <NativeSelect value={searchType} name="searchType" onChange={this.handleValueChange(setSearchType)}>
                <option value="favendo">Favendo</option>
                <option value="openDB">Open DB</option>
                <option value="favOpenDB">Open DB + Favendo</option>
                <option value="openData">Open Data</option>
                <option value="openDataOffline">Open Data Offline</option>
                <option value="hafas">HAFAS</option>
                <option value="dbNav">DB Navigator</option>
                <option value="stationsdata">Open Data Stationsdaten</option>
              </NativeSelect>
            }
            label="API zur Stationssuche"
          />
          <BrowserstackThanks />
        </DialogContent>
      </Dialog>
    );
  }
}

export const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  autoUpdate: {
    width: '3em',
  },
};

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, AbfahrtenState, _>(
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
    setFahrzeugGruppe,
    setLineAndNumber,
    setAutoUpdate,
  }
)(withStyles(styles)(SettingsModal));
