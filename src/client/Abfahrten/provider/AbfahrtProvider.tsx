import constate from '@/constate';
import { trpc } from '@/router';
import type { Abfahrt } from '@/types/iris';

interface AbfahrtInitialState {
	abfahrt: Abfahrt;
	detail: boolean;
}

const useInternalAbfahrt = ({ abfahrt, detail }: AbfahrtInitialState) => {
	const { data: foundJourney } = trpc.journeys.find.useQuery(
		{
			trainNumber: Number.parseInt(abfahrt.train.number),
			category: abfahrt.train.type,
			initialDepartureDate: abfahrt.initialDeparture,
			limit: 1,
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
			enabled: detail,
			select: (r) => r[0],
		},
	);

	return {
		abfahrt,
		detail,
		journeyId: foundJourney?.journeyId,
	};
};

export const [AbfahrtProvider, useAbfahrt] = constate(useInternalAbfahrt);
