import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

// TODO: JourneyID stuff to specific URL? How to handle different Backends?

export const Route = createFileRoute('/details/$train/$initialDeparture')({
	loader: (ctx) => {
		// @ts-expect-error sadly location search not typed
		if (ctx.location.search.journeyId) {
			return ctx.context.trpcUtils.journeys.detailsByJourneyId.fetch(
				// @ts-expect-error sadly location search not typed
				ctx.location.search.journeyId,
			);
		}
	},
	validateSearch: z.object({
		evaNumberAlongRoute: z.string().optional(),
		stopEva: z.string().optional(),
		station: z.string().optional(),
		journeyId: z.string().optional(),
		jid: z.string().optional(),
		administration: z.string().optional(),
	}),
	component: DetailsRoute,
});
