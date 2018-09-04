// @flow
import './SettingsModal.scss';
import { closeSettings, setTime } from 'actions/config';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import type { AppState } from 'AppState';
import { Link } from 'react-router-dom';

type Props = {
  open: boolean,
  timeConfig: 0 | 1,
  closeSettings: typeof closeSettings,
  setTime: typeof setTime,
};

class SettingsModal extends React.PureComponent<Props> {
  handleTimeChange = e => {
    this.props.setTime(e.target.checked ? 1 : 0);
  };
  render() {
    const { open, closeSettings, timeConfig } = this.props;

    return (
      <Dialog open={open} onClose={closeSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent className="SettingsModal">
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={Boolean(timeConfig)} value="timeConfig" onChange={this.handleTimeChange} />}
                label="Zeige neue Ankunft bei Verspätung"
              />
            </FormGroup>
          </FormControl>
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
  }),
  {
    closeSettings,
    setTime,
  }
)(SettingsModal);
