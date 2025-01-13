import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/details/$train')({
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
