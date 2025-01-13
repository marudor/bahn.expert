import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import constate from '@/constate';
import { trpc } from '@/router';
import { useNavigate } from '@tanstack/react-router';
import { addDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';

interface Props {
	trainName: string;
	initialDepartureDateString?: string;
	evaNumberAlongRoute?: string;
	journeyId?: string;
	// HAFAS
	jid?: string;
	administration?: string;
}

const useInnerDetails = ({
	initialDepartureDateString,
	evaNumberAlongRoute,
	trainName,
	journeyId,
	jid,
	administration,
}: Props) => {
	const { autoUpdate } = useCommonConfig();
	const [isMapDisplay, setIsMapDisplay] = useState(false);
	const [showMarkers, setShowMarkers] = useState(false);
	const initialDepartureDate = useMemo(() => {
		if (!initialDepartureDateString) return new Date();
		const initialDepartureNumber = +initialDepartureDateString;
		return new Date(
			Number.isNaN(initialDepartureNumber)
				? initialDepartureDateString
				: initialDepartureNumber,
		);
	}, [initialDepartureDateString]);

	const {
		data: details,
		refetch: refetchDetails,
		isFetching,
		error,
	} = trpc.journeys.details.useQuery({
		trainName,
		initialDepartureDate,
		evaNumberAlongRoute,
		administration,
		journeyId,
		jid,
	});
	const navigate = useNavigate();
	const trpcUtils = trpc.useUtils();

	const sameTrainDaysInFuture = useCallback(
		(daysForward: number) => {
			const oldDate = details?.departure.scheduledTime || initialDepartureDate;
			const newDate = addDays(oldDate, daysForward);
			const newAdministration = administration || details?.train.admin;
			navigate({
				to: '/details/$train/$initialDeparture',
				params: {
					train: trainName,
					initialDeparture: newDate.toISOString(),
				},
				search: {
					administration: newAdministration,
				},
			});
		},
		[initialDepartureDate, details, administration, navigate, trainName],
	);

	useEffect(() => {
		if (!details) {
			return;
		}
		if (details.journeyId) {
			navigate({
				to: '/details/$train',
				params: {
					train: trainName,
				},
				search: {
					journeyId: details.journeyId,
				},
				replace: true,
				from: '/details/$train',
			});
		}
	}, [details, trainName, navigate]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		const cleanup = () => clearInterval(intervalId);
		if (autoUpdate) {
			intervalId = setInterval(() => {
				refetchDetails({
					throwOnError: false,
				});
			}, autoUpdate * 1000);
		} else {
			cleanup();
		}
		return cleanup;
	}, [autoUpdate, refetchDetails]);

	const toggleMapDisplay = useCallback(
		() => setIsMapDisplay((old) => !old),
		[],
	);

	const toggleShowMarkers = useCallback((e: MouseEvent) => {
		e.preventDefault();
		setShowMarkers((old) => !old);
	}, []);

	return {
		initialDepartureDate,
		trainName,
		details,
		isFetching,
		error,
		refreshDetails: refetchDetails,
		isMapDisplay,
		toggleMapDisplay,
		showMarkers,
		toggleShowMarkers,
		sameTrainDaysInFuture,
	};
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
