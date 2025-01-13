import { StopPlaceSearch } from '@/client/Common/Components/StopPlaceSearch';
import {
	useRoutingConfig,
	useRoutingConfigActions,
} from '@/client/Routing/provider/RoutingConfigProvider';
import { useFetchRouting } from '@/client/Routing/provider/useFetchRouting';
import Delete from '@mui/icons-material/Delete';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import SwapVert from '@mui/icons-material/SwapVert';
import Today from '@mui/icons-material/Today';
import {
	Button,
	Divider,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	css,
	styled,
} from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useParams } from '@tanstack/react-router';
import {
	type Day,
	addDays,
	endOfDay,
	isSameDay,
	isSameYear,
	isWithinInterval,
	lightFormat,
	startOfDay,
	subDays,
} from 'date-fns';
import { de as deLocale } from 'date-fns/locale/de';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import { SettingsPanel } from './SettingsPanel';

const DateTimeContainer = styled(Stack)`
  flex-direction: row;
  align-items: center;
  & input {
    cursor: pointer;
  }
`;

const StyledRadioGroup = styled(RadioGroup)`
  flex-direction: row;
  flex: 1;
  flex-wrap: nowrap;
`;

const iconCss = css`
  right: 0.4em;
  position: absolute;
  align-self: center;
  cursor: pointer;
`;

const TodayIcon = styled(Today)`
  pointer-events: none;
  ${iconCss}
`;

const SwapOriginDest = styled(SwapVert)`
  ${iconCss}
`;

const ClearIcon = SwapOriginDest.withComponent(Delete);

const Buttons = styled('div')(({ theme }) => ({
	display: 'flex',
	margin: '15px 0 1em',
	'& > button:nth-of-type(1)': {
		flex: 2,
	},
	'& > button:nth-of-type(2)': {
		flex: 1,
	},
	'& > button': {
		margin: '0 10px',
		height: 50,
		fontSize: '1rem',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '5px 20px',
		color: theme.vars.palette.text.primary,
	},
}));

const DateTimePickerInput = styled(TextField)`
  width: 100%;
`;

export const Search: FC = () => {
	const { setStart, setDestination, updateVia, setDate, updateDepartureMode } =
		useRoutingConfigActions();
	const { start, destination, date, via, departureMode, touchedDate } =
		useRoutingConfig();
	const { clearRoutes, fetchRoutesAndNavigate } = useFetchRouting();

	const calculateFormattedDate = useCallback(() => {
		if (!touchedDate) {
			return `Jetzt (Heute ${lightFormat(new Date(), 'HH:mm')})`;
		}
		const today = startOfDay(new Date());
		const tomorrow = endOfDay(addDays(today, 1));
		const yesterday = subDays(today, 1);

		let relativeDayString = '';

		if (isWithinInterval(date, { start: yesterday, end: tomorrow })) {
			if (isSameDay(date, today)) relativeDayString = 'Heute';
			else if (isSameDay(date, yesterday)) relativeDayString = 'Gestern';
			else if (isSameDay(date, tomorrow)) relativeDayString = 'Morgen';
			relativeDayString += `, ${deLocale.localize?.day(date.getDay() as Day, {
				width: 'short',
			})}`;
		} else {
			relativeDayString = deLocale.localize?.day(date.getDay() as Day);
		}
		relativeDayString += ` ${lightFormat(date, 'dd.MM.')}`;
		if (!isSameYear(date, today)) {
			relativeDayString += lightFormat(date, 'yyyy');
		}
		relativeDayString += ` ${lightFormat(date, 'HH:mm')}`;
		return relativeDayString;
	}, [touchedDate, date]);
	useEffect(
		() => setFormattedDate(calculateFormattedDate),
		[calculateFormattedDate],
	);
	const [formattedDate, setFormattedDate] = useState(calculateFormattedDate());

	const params: Record<'date', string | undefined> = useParams({
		strict: false,
	});

	useEffect(() => {
		if (params.date && params.date !== '0') {
			const dateNumber = +params.date;
			setDate(new Date(Number.isNaN(dateNumber) ? params.date : dateNumber));
		}
	}, [params.date, setDate]);

	const swapOriginDest = useCallback(() => {
		setDestination(start);
		setStart(destination);
	}, [start, destination, setStart, setDestination]);

	const searchRoute = useCallback(
		(e: SyntheticEvent) => {
			e.preventDefault();

			void fetchRoutesAndNavigate(start, destination, via);
			setFormattedDate(calculateFormattedDate);
		},
		[destination, start, via, fetchRoutesAndNavigate, calculateFormattedDate],
	);

	const mappedViaList = useMemo(
		() =>
			via.map((v, index) => (
				<Stack direction="row" key={index}>
					<StopPlaceSearch
						groupedBySales
						id={`via${index}`}
						onChange={(s) => updateVia(index, s)}
						value={v}
					/>
					<ClearIcon
						data-testid={`clearVia${index}`}
						onClick={() => updateVia(index)}
					/>
				</Stack>
			)),
		[updateVia, via],
	);

	return (
		<>
			<StopPlaceSearch
				groupedBySales
				id="routingStartSearch"
				value={start}
				onChange={setStart}
				placeholder="Start"
			/>
			<div>
				{mappedViaList}
				{mappedViaList.length < 2 && (
					<StopPlaceSearch
						groupedBySales
						placeholder="Via Station"
						id="addVia"
						onChange={(s) => updateVia(-1, s)}
					/>
				)}
			</div>
			<Stack direction="row">
				<StopPlaceSearch
					groupedBySales
					id="routingDestinationSearch"
					value={destination}
					onChange={setDestination}
					placeholder="Destination"
				/>
				<SwapOriginDest onClick={swapOriginDest} />
			</Stack>
			<DateTimeContainer>
				<StyledRadioGroup value={departureMode} onChange={updateDepartureMode}>
					<FormControlLabel
						value="ab"
						control={<Radio size="small" />}
						label="Ab"
					/>
					<FormControlLabel
						value="an"
						control={<Radio size="small" />}
						label="An"
					/>
				</StyledRadioGroup>
				<MobileDateTimePicker
					openTo="hours"
					value={date}
					slotProps={{
						actionBar: {
							actions: ['clear', 'cancel', 'accept'],
						},
					}}
					slots={{
						textField: (props) => (
							<DateTimePickerInput
								{...props}
								error={false}
								slotProps={{
									...props.slotProps,
									htmlInput: {
										...props.inputProps,
										'data-testid': 'routingDatePicker',
										value: formattedDate,
										required: false,
									},
								}}
							/>
						),
					}}
					onChange={setDate}
					minutesStep={5}
				/>
				<TodayIcon />
			</DateTimeContainer>
			<SettingsPanel />
			<Buttons>
				<Button
					data-testid="search"
					fullWidth
					variant="contained"
					onClick={searchRoute}
					color="primary"
				>
					Search
					<SearchIcon />
				</Button>
				<Button
					color="secondary"
					variant="contained"
					data-testid="toFav"
					onClick={clearRoutes}
				>
					Favs
					<FavoriteBorder />
				</Button>
			</Buttons>
			<Divider variant="middle" />
		</>
	);
};
