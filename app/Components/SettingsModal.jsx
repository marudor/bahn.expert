// @flow
import './SettingsModal.scss';
import { closeSettings, setTime, setSearchType } from 'actions/config';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import type { AppState } from 'AppState';
import { Link } from 'react-router-dom';

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
                <option value="openData">Open Data</option>
                <option value="hafas">HAFAS</option>
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
