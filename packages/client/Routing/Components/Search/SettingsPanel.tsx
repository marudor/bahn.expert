import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Chip,
  FormControlLabel,
  NativeSelect,
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
import { AllowedHafasProfile } from 'types/HAFAS';
import { ChangeEvent, useCallback, useMemo } from 'react';
import {
  RoutingConfigContainer,
  RoutingSettings,
} from 'client/Routing/container/RoutingConfigContainer';
import styled from 'styled-components';

const StyledAccordion = styled(Accordion)`
  margin: 0 !important;
  box-shadow: none;
`;
const Summary = styled(AccordionSummary)`
  > div:first-child {
    margin: 22px 0 !important;
    display: flex;
    justify-content: space-around;
  }
`;
const Details = styled(AccordionDetails)`
  flex-direction: column;
`;
const Label = styled(FormControlLabel)`
  margin-left: 0;
  & * + span {
    flex: 1;
  }
`;
const TextInput = styled(TextField)`
  width: 3.2em;
`;
const SwitchInput = TextInput.withComponent(Switch);

export const SettingsPanel = () => {
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
        <AllInclusive fontSize="small" />
      ) : (
        settings.maxChanges
      ),
    [settings.maxChanges]
  );

  return (
    <StyledAccordion>
      <Summary data-testid="routingSettingsPanel" expandIcon={<ExpandMore />}>
        <Badge
          badgeContent={maxChangesBadeContent}
          color="secondary"
          data-testid="routingSettingsPanel-maxChange"
        >
          <Cached />
        </Badge>
        <Badge
          badgeContent={`${settings.transferTime}m`}
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
      </Summary>
      <Details>
        <Label
          labelPlacement="start"
          control={
            <TextInput
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
        <Label
          labelPlacement="start"
          control={
            <TextInput
              inputProps={{ step: 5, 'data-testid': 'routingTransferTime' }}
              onChange={handleInputChange('transferTime')}
              value={settings.transferTime}
              type="number"
              name="transferTime"
            />
          }
          label="Min Umstiegszeit"
        />
        <Label
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
        <Label
          labelPlacement="start"
          control={
            <SwitchInput
              onChange={handleSwitchChange('onlyRegional')}
              checked={settings.onlyRegional}
              name="onlyRegional"
            />
          }
          label="Nur Regionalzüge"
        />
      </Details>
    </StyledAccordion>
  );
};
