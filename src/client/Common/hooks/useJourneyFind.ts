import { trpc } from '@/router';

export const useJourneyFind = (
	{
		trainNumber,
		category,
		initialDepartureDate,
	}: {
		trainNumber: number;
		category: string;
		initialDepartureDate?: Date;
	},
	options?: {
		enabled?: boolean;
	},
) =>
	trpc.journeys.find.useQuery(
		{
			trainNumber,
			category,
			initialDepartureDate,
		},
		{
			...options,
			select: (r) => r[0],
			staleTime: Number.POSITIVE_INFINITY,
		},
	);
