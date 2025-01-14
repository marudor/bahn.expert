import {
	useRoutingConfigActions,
	useRoutingSettings,
} from '@/client/Routing/provider/RoutingConfigProvider';
import type { RoutingSettings } from '@/client/Routing/provider/RoutingConfigProvider';
import AllInclusive from '@mui/icons-material/AllInclusive';
import Cached from '@mui/icons-material/Cached';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Timelapse from '@mui/icons-material/Timelapse';
import Train from '@mui/icons-material/Train';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Badge,
	Chip,
	FormControlLabel,
	Stack,
	Switch,
	TextField,
	css,
	styled,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCallback, useMemo } from 'react';
import type { ChangeEvent, FC } from 'react';

const StyledAccordion = styled(Accordion)`
  margin: 0 !important;
  box-shadow: none;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  & > *:first-of-type {
    margin: 22px 0 !important;
    display: flex;
    justify-content: space-around;
  }
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
		(key: keyof RoutingSettings) => (e: ChangeEvent<HTMLInputElement>) =>
			updateSettings(key, e.currentTarget.value),
		[updateSettings],
	);
	const handleSwitchChange = useCallback(
		(key: keyof RoutingSettings) => (_: unknown, checked: boolean) => {
			updateSettings(key, checked);
		},
		[updateSettings],
	);

	const handleHafasProfile = useCallback(
		(event: SelectChangeEvent) => {
			// @ts-expect-error just sanitized
			updateSettings('hafasProfileN', event.target.value);
		},
		[updateSettings],
	);

	const maxChangesBadeContent = useMemo(() => {
		const numberMaxChange = Number.parseInt(settings.maxChanges, 10);
		if (Number.isNaN(numberMaxChange) || numberMaxChange < 0) {
			return <AllInclusive fontSize="small" />;
		}
		return numberMaxChange.toString();
	}, [settings.maxChanges]);

	let filterLabel = 'Alle Zuege';
	if (settings.onlyRegional) {
		filterLabel = 'Nahverkehr';
	}

	return (
		<>
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
						label={filterLabel}
						icon={<Train />}
					/>
				</StyledAccordionSummary>
				<Stack component={AccordionDetails}>
					<FormLabel
						labelPlacement="start"
						control={
							<TextField
								css={inputCss}
								slotProps={{
									htmlInput: {
										'data-testid': 'routingMaxChanges',
									},
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
								slotProps={{
									htmlInput: { step: 5, 'data-testid': 'routingTransferTime' },
								}}
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
				</Stack>
			</StyledAccordion>
		</>
	);
};
