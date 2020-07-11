import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  NativeSelect,
  Switch,
  TextField,
} from '@material-ui/core';
import { AllowedHafasProfile } from 'types/HAFAS';
import { ChangeEvent, useCallback, useMemo } from 'react';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Badge from '@material-ui/core/Badge';
import CachedIcon from '@material-ui/icons/Cached';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RoutingConfigContainer, {
  RoutingSettings,
} from 'client/Routing/container/RoutingConfigContainer';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import TrainIcon from '@material-ui/icons/Train';
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

  const maxChangesBadeContent = useMemo(
    () =>
      Number.parseInt(settings.maxChanges, 10) < 0 ? (
        <AllInclusiveIcon fontSize="small" />
      ) : (
        settings.maxChanges
      ),
    [settings.maxChanges]
  );

  return (
    <Accordion className={classes.expanded}>
      <AccordionSummary
        data-testid="routingSettingsPanel"
        classes={{ content: classes.summaryContent }}
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Badge
          badgeContent={maxChangesBadeContent}
          className={classes.badge}
          color="secondary"
          data-testid="routingSettingsPanel-maxChange"
        >
          <CachedIcon />
        </Badge>
        <Badge
          badgeContent={`${settings.transferTime}m`}
          className={classes.badge}
          color="secondary"
          data-testid="routingSettingsPanel-transferTime"
        >
          <TimelapseIcon />
        </Badge>
        <Chip
          size="small"
          color="primary"
          className={classes.chip}
          label={settings.onlyRegional ? 'Nahverkehr' : 'Alle Zuege'}
          icon={<TrainIcon />}
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
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
              // @ts-ignore
              inputProps={{ 'data-testid': 'routingHafasProfile' }}
              value={settings.hafasProfile}
              name="checkIn"
              onChange={handleInputChange('hafasProfile')}
            >
              {Object.keys(AllowedHafasProfile).map((allowedProfile) => (
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
      </AccordionDetails>
    </Accordion>
  );
};

export default SettingsPanel;
