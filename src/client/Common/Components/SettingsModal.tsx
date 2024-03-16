import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  NativeSelect,
  styled,
  Switch,
  TextField,
} from '@mui/material';
import { handleConfigCheckedChange } from '@/client/Common/config';
import { useCallback } from 'react';
import {
  useCommonConfig,
  useCommonConfigOpen,
  useSetCommonConfig,
  useSetCommonConfigOpen,
} from '@/client/Common/provider/CommonConfigProvider';
import type { ChangeEvent, FC } from 'react';
import type { CommonConfig } from '@/client/Common/config';

const Title = styled(DialogTitle)`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Content = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
`;

const Label = styled(FormControlLabel)`
  justify-content: space-between;
  flex-direction: row-reverse;
  margin: 0 0 15px;
  width: 100%;
`;

const AutoUpdateField = styled(TextField)`
  width: 3em;
`;

export const SettingsModal: FC = () => {
  const setConfigOpen = useSetCommonConfigOpen();
  const configOpen = useCommonConfigOpen();
  const {
    lineAndNumber,
    fahrzeugGruppe,
    showUIC,
    autoUpdate,
    hideTravelynx,
    showCoachType,
    delayTime,
    showCancelled,
    sortByTime,
    onlyDepartures,
    lookahead,
    lookbehind,
    showRl100,
  } = useCommonConfig();
  const setCommonConfigKey = useSetCommonConfig();
  const handleSelectChange = useCallback(
    (key: keyof CommonConfig) => (e: ChangeEvent<HTMLSelectElement>) =>
      setCommonConfigKey(key, e.currentTarget.value),
    [setCommonConfigKey],
  );
  const handleNumberValueChange = useCallback(
    (key: keyof CommonConfig) => (e: ChangeEvent<HTMLInputElement>) =>
      setCommonConfigKey(key, Number.parseInt(e.currentTarget.value, 10)),
    [setCommonConfigKey],
  );

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      scroll="body"
      open={configOpen}
      onClose={() => setConfigOpen(false)}
    >
      <Title>Abfahrtsoptionen</Title>
      <Content data-testid="settingsContent">
        <Label
          control={
            <AutoUpdateField
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
        <Label
          control={
            <Switch
              data-testid="sortByTime"
              checked={sortByTime}
              value="sortByTime"
              onChange={handleConfigCheckedChange(
                'sortByTime',
                setCommonConfigKey,
              )}
            />
          }
          label="Sortiere Abfahrten nach Echtzeit"
        />
        <Label
          control={
            <Switch
              data-testid="delayTime"
              checked={delayTime}
              value="delayTime"
              onChange={handleConfigCheckedChange(
                'delayTime',
                setCommonConfigKey,
              )}
            />
          }
          label="Zeige Zeiten mit Verspätung"
        />
        <Label
          control={
            <Switch
              data-testid="lineAndNumberConfig"
              checked={lineAndNumber}
              value="lineAndNumberConfig"
              onChange={handleConfigCheckedChange(
                'lineAndNumber',
                setCommonConfigKey,
              )}
            />
          }
          label="Linie und Zugnummer"
        />
        <Label
          control={
            <Switch
              data-testid="showCancelled"
              checked={showCancelled}
              value="showCancelled"
              onChange={handleConfigCheckedChange(
                'showCancelled',
                setCommonConfigKey,
              )}
            />
          }
          label="Zeige ausfallende Fahrten"
        />
        <Label
          control={
            <Switch
              data-testid="onlyDepartures"
              checked={onlyDepartures}
              value="onlyDepartures"
              onChange={handleConfigCheckedChange(
                'onlyDepartures',
                setCommonConfigKey,
              )}
            />
          }
          label="Zeige nur Abfahrten"
        />
        <Label
          control={
            <Switch
              data-testid="hideTravelynx"
              checked={hideTravelynx}
              value="hideTravelynx"
              onChange={handleConfigCheckedChange(
                'hideTravelynx',
                setCommonConfigKey,
              )}
            />
          }
          label="Verstecke Travelynx button"
        />
        <Label
          control={
            <Switch
              data-testid="showRl100"
              checked={showRl100}
              value="showRl100"
              onChange={handleConfigCheckedChange(
                'showRl100',
                setCommonConfigKey,
              )}
            />
          }
          label="Haltestellennamen mit RL100 (Teilweise)"
        />
        <Label
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
        <Label
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
      </Content>
      <Title>Reihungsoptionen</Title>
      <Content>
        <Label
          control={
            <Switch
              data-testid="showCoachType"
              checked={showCoachType}
              value="showCoachType"
              onChange={handleConfigCheckedChange(
                'showCoachType',
                setCommonConfigKey,
              )}
            />
          }
          label="Wagentyp"
        />
        <Label
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
          label="Fahrzeuggruppen Name"
        />
        <Label
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
          label="UIC Nummer"
        />
      </Content>
    </Dialog>
  );
};
