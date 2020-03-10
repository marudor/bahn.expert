import { AllowedHafasProfile } from 'types/HAFAS';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  NativeSelect,
  Switch,
  TextField,
} from '@material-ui/core';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Badge from '@material-ui/core/Badge';
import CachedIcon from '@material-ui/icons/Cached';
import Chip from '@material-ui/core/Chip';
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
    (key: keyof RoutingSettings) => (e: ChangeEvent<any>) =>
      updateSetting(key, e.currentTarget.value),
    [updateSetting]
  );
  const handleSwitchChange = useCallback(
    (key: keyof RoutingSettings) => (_: any, checked: boolean) => {
      updateSetting(key, checked);
    },
    [updateSetting]
  );

  return (
    <ExpansionPanel className={classes.expanded}>
      <ExpansionPanelSummary
        data-testid="routingSettingsPanel"
        classes={{ content: classes.summaryContent }}
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Badge
          badgeContent={
            settings.maxChanges === '-1' ? (
              <AllInclusiveIcon fontSize="small" />
            ) : (
              settings.maxChanges
            )
          }
          className={classes.badge}
          color="secondary"
          data-testid="routingSettingsPanel-maxChange"
        >
          {' '}
          <CachedIcon />{' '}
        </Badge>
        <Badge
          badgeContent={`${settings.transferTime}m`}
          className={classes.badge}
          color="secondary"
          data-testid="routingSettingsPanel-transferTime"
        >
          {' '}
          <TimelapseIcon />{' '}
        </Badge>
        <Chip
          size="small"
          color="primary"
          className={classes.chip}
          label={settings.onlyRegional ? 'Nahverkehr' : 'Alle Zuege'}
          icon={<TrainIcon />}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <TextField
              inputProps={{
                'data-testid': 'routingMaxChanges',
              }}
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
              inputProps={{ step: 5, 'data-testid': 'routingTransferTime' }}
              onChange={handleInputChange('transferTime')}
              className={classes.input}
              value={settings.transferTime}
              type="number"
              name="transferTime"
            />
          }
          label="Min Umstiegszeit"
        />
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <NativeSelect
              inputProps={{ 'data-testid': 'routingHafasProfile' }}
              value={settings.hafasProfile}
              name="checkIn"
              onChange={handleInputChange('hafasProfile')}
            >
              {Object.keys(AllowedHafasProfile).map(allowedProfile => (
                <option
                  key={allowedProfile}
                  // @ts-ignore
                  value={AllowedHafasProfile[allowedProfile]}
                >
                  {allowedProfile}
                </option>
              ))}
            </NativeSelect>
          }
          label="HAFAS Provider"
        />
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <Switch
              onChange={handleSwitchChange('onlyRegional')}
              className={classes.input}
              checked={settings.onlyRegional}
              name="onlyRegional"
            />
          }
          label="Nur Regionalzüge"
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SettingsPanel;
