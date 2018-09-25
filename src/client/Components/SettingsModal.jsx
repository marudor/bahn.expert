// @flow
import './SettingsModal.scss';
import { closeSettings, setSearchType, setTime } from 'client/actions/config';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import type { AppState } from 'AppState';

type Props = {
  open: boolean,
  timeConfig: boolean,
  searchType: string,
  closeSettings: typeof closeSettings,
  setTime: typeof setTime,
  setSearchType: typeof setSearchType,
};

class SettingsModal extends React.PureComponent<Props> {
  handleTimeChange = e => {
    this.props.setTime(e.target.checked);
  };
  changeSearchType = e => {
    this.props.setSearchType(e.target.value);
  };
  render() {
    const { open, closeSettings, timeConfig, searchType } = this.props;

    return (
      <Dialog fullWidth open={open} onClose={closeSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent className="SettingsModal">
          <FormControlLabel
            control={<Switch checked={timeConfig} value="timeConfig" onChange={this.handleTimeChange} />}
            label="Zeige neue Ankunft bei Verspätung"
          />
          <FormControlLabel
            control={
              <NativeSelect value={searchType} name="searchType" onChange={this.changeSearchType}>
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
          {/* <Link to="/Privacy" className="SettingsModal__privacy" onClick={closeSettings}>
            Datenschutz
          </Link> */}
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect(
  (state: AppState) => ({
    open: state.config.open,
    timeConfig: state.config.time,
    searchType: state.config.searchType,
  }),
  {
    closeSettings,
    setTime,
    setSearchType,
  }
)(SettingsModal);
