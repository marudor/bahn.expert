import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { trpc } from '@/client/RPC';
import type { HafasStation, ParsedPolyline } from '@/types/HAFAS';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { RouteAuslastung, RouteStop } from '@/types/routing';
import constate from 'constate';
import { addDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router';

interface Props {
	trainName: string;
	initialDepartureDateString?: string;
	evaNumberAlongRoute?: string;
	urlPrefix?: string;
	journeyId?: string;
	// HAFAS
	jid?: string;
	administration?: string;
}

const useInnerDetails = ({
	initialDepartureDateString,
	evaNumberAlongRoute,
	trainName,
	urlPrefix,
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
		error,
	} = trpc.journeys.details.useQuery({
		trainName,
		initialDepartureDate,
		evaNumberAlongRoute,
		journeyId,
		administration,
		jid,
	});

	const [additionalInformation, setAdditionalInformation] =
		useState<AdditionalJourneyInformation>();
	const navigate = useNavigate();
	const trpcUtils = trpc.useUtils();

	const sameTrainDaysInFuture = useCallback(
		(daysForward: number) => {
			const oldDate = details?.departure.scheduledTime || initialDepartureDate;
			const newDate = addDays(oldDate, daysForward);
			const newAdministration = administration || details?.train.admin;
			navigate(
				`${
					urlPrefix || '/'
				}details/${trainName}/${newDate.toISOString()}?administration=${newAdministration}`,
			);
			setAdditionalInformation(undefined);
		},
		[
			initialDepartureDate,
			details,
			administration,
			navigate,
			urlPrefix,
			trainName,
		],
	);

	useEffect(() => {
		if (!details) {
			return;
		}
		const fetchAdditional = async () => {
			if (details.journeyId) {
				try {
					setAdditionalInformation(
						await trpcUtils.hafas.additionalInformation.fetch(
							{
								trainName,
								journeyId: details.journeyId,
								initialDepartureDate,
								evaNumberAlongRoute:
									details.stops[details.stops.length - 1].station.evaNumber,
							},
							{
								staleTime: Number.POSITIVE_INFINITY,
							},
						),
					);
				} catch {
					// ignoring this
				}
			} else {
				const occupancy: Record<string, RouteAuslastung> = {};
				for (const s of details.stops) {
					if (s.auslastung) {
						occupancy[s.station.evaNumber] = s.auslastung;
					}
				}
				setAdditionalInformation({
					occupancy,
				});
			}
		};
		fetchAdditional();
	}, [details, trainName, initialDepartureDate, trpcUtils]);

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

	const matchedPolyline:
		| (Omit<ParsedPolyline, 'locations'> & {
				locations: (HafasStation & {
					details?: RouteStop;
				})[];
		  })
		| undefined = useMemo(() => {
		const polyline = additionalInformation?.polyline || details?.polyline;
		if (!polyline) return undefined;
		if (!details) return undefined;

		for (const loc of polyline.locations) {
			const detailsLoc = details.stops.find(
				(s) => s.station.evaNumber === loc.evaNumber,
			);
			if (detailsLoc) {
				// @ts-expect-error adding information
				loc.details = detailsLoc;
			}
		}

		return polyline;
	}, [details, additionalInformation]);

	return {
		initialDepartureDate,
		trainName,
		details,
		additionalInformation,
		error,
		urlPrefix,
		refreshDetails: refetchDetails,
		polyline: matchedPolyline,
		isMapDisplay,
		toggleMapDisplay,
		showMarkers,
		toggleShowMarkers,
		sameTrainDaysInFuture,
	};
};

export const [DetailsProvider, useDetails] = constate(useInnerDetails);
