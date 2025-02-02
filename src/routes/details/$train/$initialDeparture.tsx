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
	loaderDeps: ({
		search: {
			journeyId,
			jid,
			administration,
			evaNumberAlongRoute,
			stopEva,
			station,
		},
	}) => ({
		journeyId,
		jid,
		administration,
		evaNumberAlongRoute: evaNumberAlongRoute || stopEva || station,
	}),
	loader: async ({
		context: { trpcUtils },
		deps: { journeyId, jid, administration, evaNumberAlongRoute },
		params: { train, initialDeparture },
	}) => {
		if (journeyId) {
			return redirect({
				to: '/details/$train/j/$journeyId',
				replace: true,
				params: {
					train,
					journeyId,
				},
			});
		}
		const productDetails = getCategoryAndNumberFromName(train);
		if (!productDetails) {
			return redirect404(train);
		}
		if (jid && productDetails.trainNumber === 0) {
			return redirect({
				to: '/details/$train/h/$jid',
				replace: true,
				params: {
					train,
					jid,
				},
			});
		}
		const initialDepartureNumber = +initialDeparture;
		const initialDepartureDate =
			initialDepartureNumber === 0
				? undefined
				: new Date(
						Number.isNaN(initialDepartureNumber)
							? initialDeparture
							: initialDepartureNumber,
					);
		const foundJourney = await trpcUtils.journeys.find
			.fetch(
				{
					trainNumber: productDetails.trainNumber,
					administration: administration,
					category: productDetails.category,
					evaNumberAlongRoute,
					initialDepartureDate,
					withOEV: true,
					limit: 1,
				},
				{
					staleTime: Number.POSITIVE_INFINITY,
				},
			)
			.catch(() => []);
		if (foundJourney.length) {
			return redirect({
				to: '/details/$train/j/$journeyId',
				params: {
					train,
					journeyId: foundJourney[0].journeyId,
				},
				replace: true,
			});
		}
		return redirect404(train);
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
