import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Chip,
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
} from '@material-ui/core';
import {
  AllInclusive,
  Cached,
  ExpandMore,
  Timelapse,
  Train,
} from '@material-ui/icons';
import { useCallback, useMemo } from 'react';
import {
  useRoutingConfigActions,
  useRoutingSettings,
} from 'client/Routing/provider/RoutingConfigProvider';
import type { ChangeEvent, FC } from 'react';
import type { RoutingSettings } from 'client/Routing/provider/RoutingConfigProvider';

const useStyles = makeStyles({
  accordion: {
    margin: '0!important',
    boxShadow: 'none',
  },
  summary: {
    '& > div:first-child': {
      margin: '22px 0 !important',
      display: 'flex',
      justifyContent: 'space-around',
    },
  },
  details: {
    flexDirection: 'column',
  },
  label: {
    marginLeft: 0,
    '& * + span': {
      flex: 1,
    },
  },
  input: {
    width: '3.2em',
  },
});

export const SettingsPanel: FC = () => {
  const classes = useStyles();
  const settings = useRoutingSettings();
  const { updateSettings } = useRoutingConfigActions();
  const handleInputChange = useCallback(
    (key: keyof RoutingSettings) => (e: ChangeEvent<any>) =>
      updateSettings(key, e.currentTarget.value),
    [updateSettings],
  );
  const handleSwitchChange = useCallback(
    (key: keyof RoutingSettings) => (_: any, checked: boolean) => {
      updateSettings(key, checked);
    },
    [updateSettings],
  );

  const maxChangesBadeContent = useMemo(() => {
    const numberMaxChange = Number.parseInt(settings.maxChanges, 10);
    if (Number.isNaN(numberMaxChange) || numberMaxChange <= 0) {
      return <AllInclusive fontSize="small" />;
    }
    return numberMaxChange;
  }, [settings.maxChanges]);

  return (
    <Accordion className={classes.accordion}>
      <AccordionSummary
        className={classes.summary}
        data-testid="routingSettingsPanel"
        expandIcon={<ExpandMore />}
      >
        <Badge
          badgeContent={maxChangesBadeContent}
          color="secondary"
          data-testid="routingSettingsPanel-maxChange"
        >
          <Cached />
        </Badge>
        <Badge
          badgeContent={`${settings.transferTime || 0}m`}
          color="secondary"
          data-testid="routingSettingsPanel-transferTime"
        >
          <Timelapse />
        </Badge>
        <Chip
          size="small"
          color="primary"
          label={settings.onlyRegional ? 'Nahverkehr' : 'Alle Zuege'}
          icon={<Train />}
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <FormControlLabel
          className={classes.label}
          labelPlacement="start"
          control={
            <TextField
              className={classes.input}
              inputProps={{
                'data-testid': 'routingMaxChanges',
              }}
              onChange={handleInputChange('maxChanges')}
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
              className={classes.input}
              inputProps={{ step: 5, 'data-testid': 'routingTransferTime' }}
              onChange={handleInputChange('transferTime')}
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
            <Switch
              className={classes.input}
              onChange={handleSwitchChange('onlyRegional')}
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
