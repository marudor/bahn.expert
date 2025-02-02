import { Details } from '@/client/Common/Components/Details';
import { DetailsProvider } from '@/client/Common/provider/DetailsProvider';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { isValid, parse } from 'date-fns';

export const Route = createFileRoute('/details/$train/j/$journeyId')({
	preload: false,
	loader: (ctx) => {
		return {
			meta: {
				title: ctx.params.train,
			},
		};
	},
	component: () => {
		const { journeyId, train } = useParams({
			from: '/details/$train/j/$journeyId',
		});
		const initialDepartureDateById = parse(
			journeyId.substring(0, 8),
			'yyyyMMdd',
			new Date(),
		);
		return (
			<DetailsProvider
				trainName={train}
				journeyId={journeyId}
				initialDepartureDate={
					isValid(initialDepartureDateById)
						? initialDepartureDateById
						: undefined
				}
			>
				<Details />
			</DetailsProvider>
		);
	},
});
