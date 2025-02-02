import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import constate from '@/constate';
import { trpc } from '@/router';
import { useNavigate } from '@tanstack/react-router';
import { addDays } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

interface SharedProps {
	trainName: string;
	administration?: string;
	initialDepartureDate?: Date;
	doNotLoad?: boolean;
}

interface PropsWithJid extends SharedProps {
	jid: string;
	journeyId?: never;
}

interface PropsWithJourneyId extends SharedProps {
	journeyId: string;
	jid?: never;
}

type Props = PropsWithJid | PropsWithJourneyId;

const useInnerDetails = ({
	trainName,
	journeyId,
	jid,
	initialDepartureDate,
	administration,
}: Props) => {
	const { autoUpdate } = useCommonConfig();
	const [isMapDisplay, setIsMapDisplay] = useState(false);
	const [showMarkers, setShowMarkers] = useState(false);

	const {
		data: details,
		refetch: refetchDetails,
		isFetching,
		error,
	} = journeyId
		? trpc.journeys.detailsByJourneyId.useQuery(journeyId)
		: trpc.journeys.detailsByJid.useQuery(jid!);

	const { data: occupancy } = trpc.journeys.occupancy.useQuery(journeyId!, {
		staleTime: 5000,
		enabled: Boolean(journeyId),
	});
	const navigate = useNavigate();

	const sameTrainDaysInFuture = useCallback(
		(daysForward: number) => {
			const oldDate =
				details?.departure.scheduledTime || initialDepartureDate || new Date();
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
		occupancy,
	};
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
