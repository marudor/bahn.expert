import { Details } from '@/client/Common/Components/Details';
import { DetailsProvider } from '@/client/Common/provider/DetailsProvider';
import { createFileRoute, useParams } from '@tanstack/react-router';

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
		return (
			<DetailsProvider trainName={train} journeyId={journeyId}>
				<Details />
			</DetailsProvider>
		);
	},
});
