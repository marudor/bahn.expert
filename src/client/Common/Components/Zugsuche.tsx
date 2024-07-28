import { ZugsucheAutocomplete } from '@/client/Common/Components/ZugsucheAutocomplete';
import { stopPropagation } from '@/client/Common/stopPropagation';
import { useStorage } from '@/client/useStorage';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import { Today, Train } from '@mui/icons-material';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
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

const StyledDialog = styled(Dialog)`
  .MuiDialog-container {
    height: initial;
  }
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
  display: flex;
  justify-content: space-between;
  max-width: 240px;
  margin: 0 auto;
`;

interface Props {
	children?: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
export const Zugsuche: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const storage = useStorage();
	const { toggleDrawer } = useContext(NavigationContext);
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
	const [filtered, setFiltered] = useState<boolean>(true);
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
				const link = [
					'',
					'details',
					`${match.train.type} ${match.train.number}`,
				];

				// istanbul ignore else
				if (date) {
					link.push(date.toISOString());
				}

				link.push(
					qs.stringify(
						{
							profile: storage.get('hafasProfile'),
							station: match.firstStop.station.evaNumber,
						},
						{ addQueryPrefix: true },
					),
				);

				navigate(link.join('/'));
				toggleModal();
				toggleDrawer();
			}
		},
		[date, storage, toggleModal, toggleDrawer, navigate],
	);

	return (
		<>
			<StyledDialog
				maxWidth="md"
				open={open}
				// @ts-expect-error stupid ts cant handle optional here
				onClose={toggleModal}
				data-testid="Zugsuche"
			>
				<Title onClick={stopPropagation}>Zugsuche</Title>
				<Content onClick={stopPropagation}>
					<form>
						<FormControl fullWidth component="fieldset">
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
											checked={filtered}
											value="filtered"
											onChange={(_e, checked) => setFiltered(checked)}
										/>
									}
									label="Nur Fernverkehr, nur aktuelle Züge"
								/>
							</InputContainer>
							<InputContainer>
								<ZugsucheAutocomplete
									filtered={filtered}
									onChange={submit}
									initialDeparture={date || undefined}
								/>
								<TrainIcon />
							</InputContainer>
						</FormControl>
					</form>
				</Content>
			</StyledDialog>
			{children?.(toggleModal)}
		</>
	);
};
