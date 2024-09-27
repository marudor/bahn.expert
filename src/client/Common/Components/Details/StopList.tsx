import { InjectUmlauf } from '@/client/Common/Components/Details/InjectUmlauf';
import { ReferenceSummary } from '@/client/Common/Components/Details/ReferenceSummary';
import { Stop } from '@/client/Common/Components/Details/Stop';
import { TransportName } from '@/client/Common/Components/Details/TransportName';
import { Error } from '@/client/Common/Error';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import type { RouteStop } from '@/types/routing';
import { Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { Loading } from '../Loading';

export const StopList: FC = () => {
	const { details, error, initialDepartureDate } = useDetails();
	const [currentSequenceStop, setCurrentSequenceStop] = useState(
		details?.currentStop?.station.evaNumber,
	);

	const onStopClick = useCallback((stop: RouteStop) => {
		setCurrentSequenceStop(stop.station.evaNumber);
	}, []);

	useEffect(() => {
		if (details?.currentStop) {
			setCurrentSequenceStop(details.currentStop.station.evaNumber);
			const scrollDom = document.getElementById(
				details.currentStop.station.evaNumber,
			);

			if (scrollDom) {
				scrollDom.scrollIntoView();
			}
		}
	}, [details]);

	const detailsStops = useMemo(() => {
		if (!details) return null;
		let hadCurrent = false;

		return (
			<>
				{details.previousJourneys?.length && (
					<div key="prev">
						Wendet aus{' '}
						{details.previousJourneys.map((previousJourney) => (
							<TransportName
								key={previousJourney.journeyID}
								transport={{
									category: previousJourney.journeyRelation.startCategory,
									journeyNumber:
										previousJourney.journeyRelation.startJourneyNumber,
									journeyID: previousJourney.journeyID,
								}}
							/>
						))}
					</div>
				)}
				{details.stops.map((s, i) => {
					if (
						details.currentStop?.station.evaNumber === s.station.evaNumber ||
						!details.currentStop
					) {
						hadCurrent = true;
					}

					return (
						<Stop
							journey={details}
							onStopClick={onStopClick}
							isPast={!hadCurrent}
							continuationFor={i === 0 ? details.continuationFor : undefined}
							continuationBy={
								i === details.stops.length - 1
									? details.continuationBy
									: undefined
							}
							train={details.train}
							stop={s}
							key={s.station.evaNumber}
							showWR={
								currentSequenceStop === s.station.evaNumber
									? details.train
									: undefined
							}
							initialDepartureDate={initialDepartureDate}
						/>
					);
				})}
				{details.nextJourneys?.length && (
					<div key="next">
						Wendet auf{' '}
						{details.nextJourneys.map((nextJourney) => (
							<TransportName
								key={nextJourney.journeyID}
								transport={{
									category: nextJourney.journeyRelation.startCategory,
									journeyNumber: nextJourney.journeyRelation.startJourneyNumber,
									journeyID: nextJourney.journeyID,
								}}
							/>
						))}
					</div>
				)}
			</>
		);
	}, [details, currentSequenceStop, onStopClick, initialDepartureDate]);

	if (error) {
		return <Error error={error} context="Zug" />;
	}

	if (!details) {
		return <Loading />;
	}

	return (
		<Stack>
			<ReferenceSummary stops={details.stops} />
			<InjectUmlauf>{detailsStops}</InjectUmlauf>
		</Stack>
	);
};
