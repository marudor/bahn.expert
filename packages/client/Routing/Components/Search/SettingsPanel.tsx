import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Chip,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import {
  AllInclusive,
  Cached,
  ExpandMore,
  Timelapse,
  Train,
} from '@mui/icons-material';
import { css } from '@emotion/react';
import { useCallback, useMemo } from 'react';
import {
  useRoutingConfigActions,
  useRoutingSettings,
} from 'client/Routing/provider/RoutingConfigProvider';
import styled from '@emotion/styled';
import type { ChangeEvent, FC } from 'react';
import type { RoutingSettings } from 'client/Routing/provider/RoutingConfigProvider';

const StyledAccordion = styled(Accordion)`
  margin: 0 !important;
  box-shadow: none;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  & > div:first-of-type {
    margin: 22px 0 !important;
    display: flex;
    justify-content: space-around;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  display: flex;
`;

const FormLabel = styled(FormControlLabel)`
  margin-left: 0;
  & * + span {
    flex: 1;
  }
`;

const inputCss = css`
  width: 3.2em;
`;

export const SettingsPanel: FC = () => {
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
    if (Number.isNaN(numberMaxChange) || numberMaxChange < 0) {
      return <AllInclusive fontSize="small" />;
    }
    return numberMaxChange;
  }, [settings.maxChanges]);

  return (
    <StyledAccordion>
      <StyledAccordionSummary
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
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <FormLabel
          labelPlacement="start"
          control={
            <TextField
              css={inputCss}
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
        <FormLabel
          labelPlacement="start"
          control={
            <TextField
              css={inputCss}
              inputProps={{ step: 5, 'data-testid': 'routingTransferTime' }}
              onChange={handleInputChange('transferTime')}
              value={settings.transferTime}
              type="number"
              name="transferTime"
            />
          }
          label="Min Umstiegszeit"
        />
        <FormLabel
          labelPlacement="start"
          control={
            <Switch
              css={inputCss}
              onChange={handleSwitchChange('onlyRegional')}
              checked={settings.onlyRegional}
              name="onlyRegional"
            />
          }
          label="Nur Regionalzüge"
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
