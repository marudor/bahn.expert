import { Disclaimer } from '@/client/TrainRuns/Components/TrainRunFilter/Disclaimer';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import {
	AvailableBRConstant,
	AvailableIdentifierConstant,
} from '@/types/coachSequence';
import type {} from '@/types/coachSequence';
import Info from '@mui/icons-material/Info';
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	styled,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useCallback } from 'react';
import type { FC } from 'react';

const FilterContainer = styled(Stack)`
  flex-direction: row;
  margin-top: 1em;
  justify-content: space-between;
  & > .MuiFormControl-root {
    flex: 1;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
`;

const ButtonContainer = styled(Stack)`
  flex-direction: row;
  > button {
    margin-left: 0.5em;
  }
`;

export const TrainRunFilter: FC = () => {
	const { date, setDate, baureihen, setBaureihen, identifier, setIdentifier } =
		useTrainRuns();

	const resetFilter = useCallback(() => {
		setBaureihen([]);
		setIdentifier([]);
	}, [setBaureihen, setIdentifier]);

	const handleBaureihenChange = useCallback(
		(e: SelectChangeEvent<string | string[]>) => {
			const {
				target: { value },
			} = e;
			// @ts-expect-error this works
			setBaureihen(typeof value === 'string' ? value.split(',') : value);
		},
		[setBaureihen],
	);

	const handleIdentifierChange = useCallback(
		(e: SelectChangeEvent<string | string[]>) => {
			const {
				target: { value },
			} = e;
			// @ts-expect-error this works
			setIdentifier(typeof value === 'string' ? value.split(',') : value);
		},
		[setIdentifier],
	);

	return (
		<div>
			<FilterContainer>
				<MobileDatePicker
					slots={{
						textField: (props) => (
							<TextField
								{...props}
								label="Datum"
								slotProps={{
									htmlInput: {
										...props.inputProps,
										'data-testid': 'trainRunsDatePicker',
									},
								}}
							/>
						),
					}}
					value={date}
					onAccept={setDate as any}
				/>
				<FormControl>
					<InputLabel id="brLabel">Baureihen</InputLabel>
					<Select
						labelId="brLabel"
						value={baureihen}
						multiple
						onChange={handleBaureihenChange}
					>
						{AvailableBRConstant.map((br) => (
							<MenuItem key={br} value={br}>
								{br}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id="identifierLabel">Identifier</InputLabel>
					<Select
						labelId="identifierLabel"
						value={identifier}
						multiple
						onChange={handleIdentifierChange}
					>
						{AvailableIdentifierConstant.map((br) => (
							<MenuItem key={br} value={br}>
								{br}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</FilterContainer>
			<ButtonContainer>
				<Button color="warning" variant="outlined" onClick={resetFilter}>
					Reset BR/Identifier
				</Button>
				<Disclaimer>
					{(toggleModal) => (
						<Button color="info" variant="outlined" onClick={toggleModal}>
							Informationen
							<Info />
						</Button>
					)}
				</Disclaimer>
			</ButtonContainer>
			<hr />
		</div>
	);
};
