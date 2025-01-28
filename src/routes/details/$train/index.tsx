import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/details/$train/')({
	beforeLoad: (ctx) => {
		return redirect({
			to: '/details/$train/$initialDeparture',
			params: {
				train: ctx.params.train,
				initialDeparture: '0',
			},
		});
	},
	validateSearch: z.object({
		evaNumberAlongRoute: z.string().optional(),
		stopEva: z.string().optional(),
		station: z.string().optional(),
		journeyId: z.string().optional(),
		jid: z.string().optional(),
		administration: z.string().optional(),
	}),
	component: () => null,
});
