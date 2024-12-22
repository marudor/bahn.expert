import { BC100Disclaimer } from '@/client/Routing/Components/Search/BC100Disclaimer';
import { NetzcardDisclaimer } from '@/client/Routing/Components/Search/NetzcardDisclaimer';
import {
	useRoutingConfigActions,
	useRoutingSettings,
} from '@/client/Routing/provider/RoutingConfigProvider';
import type { RoutingSettings } from '@/client/Routing/provider/RoutingConfigProvider';
import { AllowedHafasProfile, TripSearchType } from '@/types/HAFAS';
import {
	AllInclusive,
	Cached,
	ExpandMore,
	Timelapse,
	Train,
} from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Badge,
	Chip,
	FormControl,
	FormControlLabel,
	MenuItem,
	Select,
	Stack,
	Switch,
	TextField,
	css,
	styled,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

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
	const [showNetzcardDisclaimer, setShowNetzcardDisclaimer] = useState(false);
	const [showBC100Disclaimer, setShowBC100Disclaimer] = useState(false);
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
	const handleNetzcard = useCallback(
		(_: unknown, checked: boolean) => {
			updateSettings('onlyNetzcard', checked);
			setShowNetzcardDisclaimer(checked);
		},
		[updateSettings],
	);

	const handleBC100 = useCallback(
		(_: unknown, checked: boolean) => {
			updateSettings('onlyBC100', checked);
			setShowBC100Disclaimer(checked);
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

	const handleTripType = useCallback(
		(event: SelectChangeEvent) => {
			// @ts-expect-error just sanitized
			updateSettings('type', event.target.value);
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
	if (settings.onlyNetzcard && settings.onlyRegional) {
		filterLabel = 'Nahverkehr (Netzcard)';
	}
	if (settings.onlyNetzcard) {
		filterLabel = 'Netzcard';
	}
	if (settings.onlyRegional) {
		filterLabel = 'Nahverkehr';
	}
	if (settings.onlyBC100) {
		filterLabel = 'BC100';
	}

	return (
		<>
			{showNetzcardDisclaimer && <NetzcardDisclaimer />}
			{showBC100Disclaimer && <BC100Disclaimer />}
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
					<FormControl size="small">
						<FormLabel
							labelPlacement="start"
							control={
								<Select
									value={settings.hafasProfileN || ''}
									onChange={handleHafasProfile}
								>
									<MenuItem value={AllowedHafasProfile.BAHN}>bahn.de</MenuItem>
									<MenuItem value={AllowedHafasProfile.DB}>
										Business DB Navigator (Legacy)
									</MenuItem>
									<MenuItem value={AllowedHafasProfile.OEBB}>
										OEBB Scotty
									</MenuItem>
								</Select>
							}
							label="Datenlieferant"
						/>
					</FormControl>

					<FormLabel
						labelPlacement="start"
						control={
							<Switch
								css={inputCss}
								onChange={handleNetzcard}
								checked={settings.onlyNetzcard}
								name="onlyNetzcard"
							/>
						}
						label="Netzcard erlaubt"
					/>

					<FormLabel
						labelPlacement="start"
						control={
							<Switch
								css={inputCss}
								onChange={handleBC100}
								checked={settings.onlyBC100}
								name="onlyBC100"
							/>
						}
						label="BC100 erlaubt"
					/>

					{settings.hafasProfileN !== AllowedHafasProfile.BAHN && (
						<FormControl size="small">
							<FormLabel
								labelPlacement="start"
								control={
									<Select value={settings.type || ''} onChange={handleTripType}>
										<MenuItem value={TripSearchType.FIRST}>
											Erste Route
										</MenuItem>
										<MenuItem value={TripSearchType.ANY}>Jede Route</MenuItem>
										<MenuItem value={TripSearchType.LAST}>
											Letzte Route
										</MenuItem>
									</Select>
								}
								label="Routentyp"
							/>
						</FormControl>
					)}
				</Stack>
			</StyledAccordion>
		</>
	);
};
