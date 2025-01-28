import { Loading } from '@/client/Common/Components/Loading';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

const trainNumberRegex = /(.*?)(\d+).*/;
function getCategoryAndNumberFromName(trainName: string):
	| {
			trainNumber: number;
			category?: string;
	  }
	| undefined {
	const regexResult = trainNumberRegex.exec(trainName);
	const trainNumber = Number.parseInt(regexResult?.[2].trim() || '');
	const category = regexResult?.[1]?.trim();

	if (!Number.isNaN(trainNumber)) {
		return {
			trainNumber,
			category: category?.length ? category : undefined,
		};
	}
}

const redirect404 = (train: string) =>
	redirect({
		to: '/details/$train/j/$journeyId',
		params: {
			train,
			journeyId: '404',
		},
	});

export const Route = createFileRoute('/details/$train/$initialDeparture')({
	beforeLoad: async (ctx) => {
		if (ctx.search.journeyId) {
			return redirect({
				to: '/details/$train/j/$journeyId',
				replace: true,
				params: {
					train: ctx.params.train,
					journeyId: ctx.search.journeyId,
				},
			});
		}
		const productDetails = getCategoryAndNumberFromName(ctx.params.train);
		if (!productDetails) {
			return redirect404(ctx.params.train);
		}
		if (ctx.search.jid && productDetails.trainNumber === 0) {
			return redirect({
				to: '/details/$train/h/$jid',
				replace: true,
				params: {
					train: ctx.params.train,
					jid: ctx.search.jid,
				},
			});
		}
		const initialDepartureNumber = +ctx.params.initialDeparture;
		const initialDepartureDate =
			initialDepartureNumber === 0
				? undefined
				: new Date(
						Number.isNaN(initialDepartureNumber)
							? ctx.params.initialDeparture
							: initialDepartureNumber,
					);
		const foundJourney = await ctx.context.trpcUtils.journeys.find.fetch(
			{
				trainNumber: productDetails.trainNumber,
				administration: ctx.search.administration,
				category: productDetails.category,
				evaNumberAlongRoute:
					ctx.search.evaNumberAlongRoute ||
					ctx.search.stopEva ||
					ctx.search.station,
				initialDepartureDate,
				withOEV: true,
				limit: 1,
			},
			{
				staleTime: Number.POSITIVE_INFINITY,
			},
		);
		if (foundJourney.length) {
			return redirect({
				to: '/details/$train/j/$journeyId',
				params: {
					train: ctx.params.train,
					journeyId: foundJourney[0].journeyId,
				},
				replace: true,
			});
		}
		return redirect404(ctx.params.train);
	},
	pendingComponent: Loading,
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
