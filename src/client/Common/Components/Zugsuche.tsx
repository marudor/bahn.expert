import { ZugsucheAutocomplete } from '@/client/Common/Components/ZugsucheAutocomplete';
import { stopPropagation } from '@/client/Common/stopPropagation';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import { Today, Train } from '@mui/icons-material';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Switch,
	TextField,
	styled,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { subHours } from 'date-fns';
import qs from 'qs';
import { useCallback, useContext, useState } from 'react';
import type { FC, ReactElement, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import { NavigationContext } from './Navigation/NavigationContext';

const Title = styled(DialogTitle)`
  text-align: center;
  padding: 16px 24px 0 24px;
`;

const Content = styled(DialogContent)`
  min-width: 40%;
`;

const StyledContent = styled(Content)`
	display: flex;
	flex-direction: column;
`;

const DateInputField = styled(TextField)`
  margin: 20px;
`;
const TrainIcon = styled(Train)`
  position: absolute;
  right: 20px;
  top: 39px;
`;
const TodayIcon = TrainIcon.withComponent(Today);

const InputContainer = styled('div')`
  position: relative;
  max-width: 240px;
  margin: 0 auto;
	flex-shrink: 0;
`;

interface Props {
	children?: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
export const Zugsuche: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const { toggleDrawer } = useContext(NavigationContext);
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
	const [withOEV, setWithOEV] = useState<boolean>(false);
	const toggleModal = useCallback(
		(e?: SyntheticEvent) => {
			e?.stopPropagation();
			setOpen(!open);
		},
		[open],
	);
	const submit = useCallback(
		(match: ParsedJourneyMatchResponse | null) => {
			if (match) {
				toggleModal();
				toggleDrawer();

				const link = [
					'',
					'details',
					`${match.train.type} ${match.train.number}`,
				];

				// HAFAS Result
				if (match.jid.includes('#')) {
					// istanbul ignore else
					if (date) {
						link.push(date.toISOString());
					}

					link.push(
						qs.stringify(
							{
								station: match.firstStop.station.evaNumber,
							},
							{ addQueryPrefix: true },
						),
					);
				} else
					link.push(
						qs.stringify(
							{
								journeyId: match.jid,
							},
							{ addQueryPrefix: true },
						),
					);

				navigate(link.join('/'));
			}
		},
		[date, toggleModal, toggleDrawer, navigate],
	);

	return (
		<>
			<Dialog
				maxWidth="md"
				open={open}
				// @ts-expect-error stupid ts cant handle optional here
				onClose={toggleModal}
				data-testid="Zugsuche"
			>
				<Title onClick={stopPropagation}>Zugsuche</Title>
				<StyledContent onClick={stopPropagation}>
					<InputContainer>
						<MobileDatePicker
							closeOnSelect
							slotProps={{
								actionBar: {
									actions: ['today', 'cancel', 'accept'],
								},
							}}
							slots={{
								textField: (props) => <DateInputField {...props} />,
							}}
							label="Datum"
							value={date}
							onChange={setDate}
						/>
						<TodayIcon />
					</InputContainer>
					<InputContainer>
						<FormControlLabel
							control={
								<Switch
									checked={withOEV}
									value="filtered"
									onChange={(_e, checked) => setWithOEV(checked)}
								/>
							}
							label="ÖPNV berücksichtigen"
						/>
					</InputContainer>
					<InputContainer
						sx={{
							flex: 1,
							display: 'flex',
							overflow: 'hidden',
						}}
					>
						<ZugsucheAutocomplete
							withOEV={withOEV}
							onChange={submit}
							initialDeparture={date || undefined}
						/>
						<TrainIcon />
					</InputContainer>
				</StyledContent>
			</Dialog>
			{children?.(toggleModal)}
		</>
	);
};
