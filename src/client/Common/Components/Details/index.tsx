import MapDisplay from '@/client/Common/Components/Details/MapDisplay';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import { format } from 'date-fns';
import { useEffect } from 'react';
import type { FC } from 'react';
import { Header } from './Header';
import { StopList } from './StopList';

export const Details: FC = () => {
	const { updateTitle, updateDescription, updateKeywords } =
		useHeaderTagsActions();
	const { initialDepartureDate, details, trainName, isMapDisplay } =
		useDetails();

	useEffect(() => {
		let name = details?.train.name || trainName;
		if (details?.train.number && !name.endsWith(details.train.number)) {
			name = `${name} (${details.train.number})`;
		}
		if (details) {
			updateTitle(`${name} @ ${format(details.departure.time, 'dd.MM.yyyy')}`);
			const codeshares = details.stops
				.flatMap((d) => d.codeShares)
				.filter(Boolean)
				.map((c) => `${c.airlineCode}${c.flightnumber}`);
			updateKeywords([details.train.name, ...codeshares]);
		} else {
			updateTitle(trainName);
		}
		let description = `Details zu ${name}`;

		if (initialDepartureDate) {
			description += ` am ${format(initialDepartureDate, 'dd.MM.yyyy')}`;
		}
		updateDescription(description);
	}, [
		details,
		initialDepartureDate,
		trainName,
		updateDescription,
		updateTitle,
		updateKeywords,
	]);

	return (
		<>
			<Header />
			{isMapDisplay ? <MapDisplay /> : <StopList />}
		</>
	);
};
