import { AbfahrtenList } from '@/client/Abfahrten/Components/AbfahrtenList';
import { Error } from '@/client/Common/Error';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_abfahrten/$stopPlace')({
	loader: async (ctx) => {
		const stopPlace = await ctx.context.trpcUtils.stopPlace.byName.fetch({
			searchTerm: ctx.params.stopPlace,
			filterForIris: true,
			max: 1,
		});
		if (!stopPlace.length) {
			throw notFound();
		}
	},
	validateSearch: z.object({
		filter: z.string().optional(),
	}),
	component: AbfahrtenList,
	notFoundComponent: () => {
		const { stopPlace } = Route.useParams();
		return <Error>{stopPlace} existiert nicht</Error>;
	},
});
