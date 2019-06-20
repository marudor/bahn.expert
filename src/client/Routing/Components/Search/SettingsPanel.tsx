import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import { setMaxChanges, setTransferTime } from 'Routing/actions/routing';
import { useDispatch } from 'react-redux';
import { useRoutingSelector } from 'useSelector';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { ChangeEvent, useCallback } from 'react';
import useStyles from './SettingsPanel.style';

const SettingsPanel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settings = useRoutingSelector(state => state.routing.settings);
  const handleInputChange = useCallback(
    (fn: (s: any) => any) => (e: ChangeEvent<HTMLSelectElement>) =>
      dispatch(fn(e.currentTarget.value)),
    [dispatch]
  );

  return (
    <ExpansionPanel className={classes.expanded}>
      <ExpansionPanelSummary
        classes={{ content: classes.summaryContent }}
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        {settings.maxChanges} Umstiege / {settings.transferTime}m Umstiegszeit
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <TextField
              onChange={handleInputChange(setMaxChanges)}
              className={classes.input}
              value={settings.maxChanges}
              type="number"
              name="maxChanges"
            />
          }
          label="Max Umstiege"
        />
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <TextField
              inputProps={{ step: 5 }}
              onChange={handleInputChange(setTransferTime)}
              className={classes.input}
              value={settings.transferTime}
              type="number"
              name="transferTime"
            />
          }
          label="Min Umstiegszeit"
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SettingsPanel;
