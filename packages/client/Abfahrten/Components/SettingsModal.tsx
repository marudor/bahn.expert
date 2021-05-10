import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  NativeSelect,
  Switch,
  TextField,
} from '@material-ui/core';
import { handleConfigCheckedChange } from 'client/Common/config';
import {
  useAbfahrtenConfig,
  useAbfahrtenConfigOpen,
  useAbfahrtenModalToggle,
  useAbfahrtenSetConfig,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback } from 'react';
import {
  useCommonConfig,
  useSetCommonConfig,
} from 'client/Common/provider/CommonConfigProvider';
import type { AbfahrtenConfig } from 'client/Common/config';
import type { ChangeEvent, FC } from 'react';

const useStyles = makeStyles({
  title: {
    '& h2': {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    margin: '0 auto',
  },
  label: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    margin: '0 0 15px',
    width: '100%',
  },
  autoUpdate: {
    width: '3em',
  },
});

export const SettingsModal: FC = () => {
  const classes = useStyles();
  const { lineAndNumber, lookahead, autoUpdate, lookbehind } =
    useAbfahrtenConfig();
  const { setConfigOpen } = useAbfahrtenModalToggle();
  const configOpen = useAbfahrtenConfigOpen();
  const setConfigKey = useAbfahrtenSetConfig();
  const { fahrzeugGruppe, showUIC, zoomReihung, time } = useCommonConfig();
  const setCommonConfigKey = useSetCommonConfig();
  const handleSelectChange = useCallback(
    (key: keyof AbfahrtenConfig) => (e: ChangeEvent<HTMLSelectElement>) =>
      setConfigKey(key, e.currentTarget.value),
    [setConfigKey],
  );
  const handleNumberValueChange = useCallback(
    (key: keyof AbfahrtenConfig) => (e: ChangeEvent<HTMLInputElement>) =>
      setConfigKey(key, Number.parseInt(e.currentTarget.value, 10)),
    [setConfigKey],
  );

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={configOpen}
      onClose={() => setConfigOpen(false)}
    >
      <DialogTitle className={classes.title}>Settings</DialogTitle>
      <DialogContent className={classes.content} data-testid="settingsContent">
        <FormControlLabel
          className={classes.label}
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
              onChange={handleNumberValueChange('autoUpdate')}
            />
          }
          label="AutoUpdate in Sekunden"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              checked={time}
              value="timeConfig"
              onChange={handleConfigCheckedChange('time', setCommonConfigKey)}
            />
          }
          label="Neue Ankunft bei Verspätung"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              checked={zoomReihung}
              value="zoomReihungConfig"
              onChange={handleConfigCheckedChange(
                'zoomReihung',
                setCommonConfigKey,
              )}
            />
          }
          label="Reihung maximal groß"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              data-testid="lineAndNumberConfig"
              checked={lineAndNumber}
              value="lineAndNumberConfig"
              onChange={handleConfigCheckedChange(
                'lineAndNumber',
                setConfigKey,
              )}
            />
          }
          label="Zeige Linie und Zugnummer"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              data-testid="showUIC"
              checked={showUIC}
              value="showUIC"
              onChange={handleConfigCheckedChange(
                'showUIC',
                setCommonConfigKey,
              )}
            />
          }
          label="Zeige UIC Nummer"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <Switch
              data-testid="fahrzeugGruppeConfig"
              checked={fahrzeugGruppe}
              value="fahrzeugGruppeConfig"
              onChange={handleConfigCheckedChange(
                'fahrzeugGruppe',
                setCommonConfigKey,
              )}
            />
          }
          label="Zeige Fahrzeuggruppen Name"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              value={lookahead}
              name="lookahead"
              onChange={handleSelectChange('lookahead')}
            >
              <option value="60">60</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="180">180</option>
              <option value="240">240</option>
              <option value="300">300</option>
              <option value="360">360</option>
              <option value="420">420</option>
              <option value="480">480</option>
            </NativeSelect>
          }
          label="Lookahead in Minuten"
        />
        <FormControlLabel
          className={classes.label}
          control={
            <NativeSelect
              data-testid="lookbehind"
              value={lookbehind}
              name="lookbehind"
              onChange={handleSelectChange('lookbehind')}
            >
              <option value="0">0</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="120">120</option>
              <option value="240">240</option>
              <option value="480">480</option>
            </NativeSelect>
          }
          label="Lookbehind in Minuten"
        />
      </DialogContent>
    </Dialog>
  );
};
