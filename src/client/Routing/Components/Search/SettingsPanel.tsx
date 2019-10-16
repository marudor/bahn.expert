import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { ChangeEvent, useCallback } from 'react';
import RoutingConfigContainer, {
  RoutingSettings,
} from 'Routing/container/RoutingConfigContainer';
import useStyles from './SettingsPanel.style';

const SettingsPanel = () => {
  const classes = useStyles();
  const { settings, updateSetting } = RoutingConfigContainer.useContainer();
  const handleInputChange = useCallback(
    (key: keyof RoutingSettings) => (e: ChangeEvent<HTMLInputElement>) =>
      updateSetting(key, e.currentTarget.value),
    [updateSetting]
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
              onChange={handleInputChange('maxChanges')}
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
              onChange={handleInputChange('transferTime')}
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
