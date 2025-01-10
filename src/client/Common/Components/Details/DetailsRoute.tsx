import { Details } from '@/client/Common/Components/Details';
import { DetailsProvider } from '@/client/Common/provider/DetailsProvider';
import { useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';

interface Props {}

export const DetailsRoute: FC<Props> = () => {
	const query = useSearch({
		from: '/details/$train',
	});

	const {
		train,
		initialDeparture,
	}: Record<'train' | 'initialDeparture', string | undefined> = useParams({
		strict: false,
	});

	const evaNumberAlongRoute = (query.evaNumberAlongRoute ||
		query.stopEva ||
		query.station) as string | undefined;

	return (
		<DetailsProvider
			trainName={train!}
			evaNumberAlongRoute={evaNumberAlongRoute}
			initialDepartureDateString={initialDeparture}
			journeyId={query.journeyId as string | undefined}
			jid={query.jid as string | undefined}
			administration={query.administration as string | undefined}
		>
			<Details />
		</DetailsProvider>
	);
};
export default DetailsRoute;
