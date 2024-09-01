import { trpc } from '@/client/RPC';
import type { Abfahrt } from '@/types/iris';
import type { RouteAuslastung } from '@/types/routing';
import type { TrainOccupancyList } from '@/types/stopPlace';
import constate from 'constate';
import { useCallback, useState } from 'react';
import type { PropsWithChildren } from 'react';

function getAuslastungKey(abfahrt: Abfahrt) {
	return `${encodeURIComponent(
		abfahrt.currentStopPlace.name,
	)}/${encodeURIComponent(abfahrt.destination)}/${abfahrt.train.number}`;
}

function useAuslastungInner(_p: PropsWithChildren<unknown>) {
	const [auslastungen, setAuslastungen] = useState<
		Record<string, undefined | null | RouteAuslastung>
	>({});
	const trpcUtils = trpc.useUtils();
	const fetchDBAuslastung = useCallback(
		async (abfahrt: Abfahrt) => {
			if (!abfahrt.departure) {
				return;
			}
			const key = getAuslastungKey(abfahrt);
			let auslastung: RouteAuslastung | null;

			try {
				auslastung = await trpcUtils.hafas.occupancy.fetch({
					start: abfahrt.currentStopPlace.name,
					destination: abfahrt.destination,
					trainNumber: abfahrt.train.number,
					plannedDepartureTime: abfahrt.departure.scheduledTime,
					stopEva: abfahrt.currentStopPlace.evaNumber,
				});
			} catch {
				auslastung = null;
			}

			setAuslastungen((oldAuslastungen) => ({
				...oldAuslastungen,
				[key]: auslastung,
			}));
		},
		[trpcUtils.hafas.occupancy],
	);

	const [vrrAuslastungen, setVRRAuslastungen] = useState<
		Record<string, undefined | null | TrainOccupancyList>
	>({});

	const getAuslastung = useCallback(
		(abfahrt: Abfahrt) => {
			const vrrAuslastungForEva =
				vrrAuslastungen[abfahrt.currentStopPlace.evaNumber];
			const vrrAuslastung = vrrAuslastungForEva?.[abfahrt.train.number];
			if (vrrAuslastung) {
				return vrrAuslastung;
			}

			const auslastungKey = getAuslastungKey(abfahrt);
			const dbAuslastung = auslastungen[auslastungKey];
			if (dbAuslastung === undefined && abfahrt.departure) {
				void fetchDBAuslastung(abfahrt);
			} else {
				return dbAuslastung;
			}
		},
		[vrrAuslastungen, fetchDBAuslastung, auslastungen],
	);

	const fetchVRRAuslastungForEva = useCallback(
		async (eva: string) => {
			let occupancyList: TrainOccupancyList | null;
			try {
				occupancyList = await trpcUtils.stopPlace.occupancy.fetch(eva);
			} catch {
				occupancyList = null;
			}
			setVRRAuslastungen((old) => ({
				...old,
				[eva]: occupancyList,
			}));
		},
		[trpcUtils],
	);

	return {
		getAuslastung,
		fetchVRRAuslastungForEva,
	};
}

export const [AuslastungsProvider, useAuslastung] =
	constate(useAuslastungInner);
