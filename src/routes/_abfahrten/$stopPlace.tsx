import { AbfahrtenList } from '@/client/Abfahrten/Components/AbfahrtenList';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_abfahrten/$stopPlace')({
	loader: async (ctx) => {
		await ctx.context.trpcUtils.stopPlace.byName.fetch({
			searchTerm: ctx.params.stopPlace,
			filterForIris: true,
			max: 1,
		});
	},
	validateSearch: z.object({
		filter: z.string().optional(),
	}),
	component: AbfahrtenList,
});
