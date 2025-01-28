import { Details } from '@/client/Common/Components/Details';
import { DetailsProvider } from '@/client/Common/provider/DetailsProvider';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/details/$train/h/$jid')({
	loader: (ctx) => {
		ctx.context.trpcUtils.journeys.detailsByJid.prefetch(ctx.params.jid);
	},
	component: () => {
		const { jid, train } = useParams({
			from: '/details/$train/h/$jid',
		});

		return (
			<DetailsProvider trainName={train} jid={jid}>
				<Details />
			</DetailsProvider>
		);
	},
});
