// @flow
import './SettingsModal.scss';
import {
  closeSettings,
  setSearchType,
  setShowSupersededMessages,
  setTime,
  setTraewelling,
  setUseDbf,
  setZoomReihung,
} from 'client/actions/config';
import { connect } from 'react-redux';
import BrowserstackThanks from './BrowserstackThanks';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import type { AppState } from 'AppState';

type StateProps = {|
  open: boolean,
  searchType: string,
  showSupersededMessagesConfig: boolean,
  timeConfig: boolean,
  traewellingConfig: boolean,
  useDbfConfig: boolean,
  zoomReihungConfig: boolean,
|};

type DispatchProps = {|
  closeSettings: typeof closeSettings,
  setSearchType: typeof setSearchType,
  setShowSupersededMessages: typeof setShowSupersededMessages,
  setTime: typeof setTime,
  setTraewelling: typeof setTraewelling,
  setUseDbf: typeof setUseDbf,
  setZoomReihung: typeof setZoomReihung,
|};

type Props = {|
  ...StateProps,
  ...DispatchProps,
|};

class SettingsModal extends React.PureComponent<Props> {
  handleCheckedChange = fn => e => fn(e.target.checked);
  handleValueChange = fn => e => fn(e.target.value);
  render() {
    const {
      open,
      closeSettings,
      timeConfig,
      searchType,
      traewellingConfig,
      zoomReihungConfig,
      showSupersededMessagesConfig,
      useDbfConfig,
      setShowSupersededMessages,
      setUseDbf,
      setSearchType,
      setZoomReihung,
      setTraewelling,
      setTime,
    } = this.props;

    return (
      <Dialog maxWidth="md" fullWidth open={open} onClose={closeSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent className="SettingsModal">
          <FormControlLabel
            control={
              <Switch checked={useDbfConfig} value="useDbfConfig" onChange={this.handleCheckedChange(setUseDbf)} />
            }
            label="Nutze dbf für Abfahrten (deprecated)"
          />
          {!useDbfConfig && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={showSupersededMessagesConfig}
                    value="showSupersededMessagesConfig"
                    onChange={this.handleCheckedChange(setShowSupersededMessages)}
                  />
                }
                label="Obsolete Messages"
              />
            </>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={traewellingConfig}
                value="traewellingConfig"
                onChange={this.handleCheckedChange(setTraewelling)}
              />
            }
            label="Traewelling Link"
          />
          <FormControlLabel
            control={<Switch checked={timeConfig} value="timeConfig" onChange={this.handleCheckedChange(setTime)} />}
            label="Neue Ankunft bei Verspätung"
          />
          <FormControlLabel
            control={
              <Switch
                checked={zoomReihungConfig}
                value="zoomReihungConfig"
                onChange={this.handleCheckedChange(setZoomReihung)}
              />
            }
            label="Reihung maximal groß"
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

export default connect<AppState, Function, {||}, StateProps, DispatchProps>(
  state => ({
    open: state.config.open,
    searchType: state.config.searchType,
    showSupersededMessagesConfig: state.config.showSupersededMessages,
    timeConfig: state.config.time,
    traewellingConfig: state.config.traewelling,
    useDbfConfig: state.config.useDbf,
    zoomReihungConfig: state.config.zoomReihung,
  }),
  {
    closeSettings,
    setTime,
    setSearchType,
    setTraewelling,
    setZoomReihung,
    setShowSupersededMessages,
    setUseDbf,
  }
)(SettingsModal);
