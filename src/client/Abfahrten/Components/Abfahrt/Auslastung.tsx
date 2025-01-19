import { useAbfahrt } from '@/client/Abfahrten/provider/AbfahrtProvider';
import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { Loading } from '@/client/Common/Components/Loading';
import { isHeavyMetal } from '@/client/utilities';
import { trpc } from '@/router';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Occupancy = styled(AuslastungsDisplay)`
  margin-top: 0.2em;
`;

export const Auslastung: FC = () => {
	const { abfahrt } = useAbfahrt();
	const { data: journeyMatch, isFetching } =
		trpc.journeys.findByNumber.useQuery(
			{
				trainNumber: Number.parseInt(abfahrt.train.number),
				category: abfahrt.train.type,
				initialDepartureDate: abfahrt.initialDeparture,
			},
			{
				select: (r) => r[0],
			},
		);

	const auslastungQuery = trpc.hafas.occupancy.useQuery(
		{
			trainNumber: abfahrt.train.number,
			stopEva: abfahrt.currentStopPlace.evaNumber,
			journeyId: journeyMatch?.jid!,
		},
		{
			enabled: Boolean(journeyMatch),
		},
	);

	if (
		auslastungQuery.isFetching &&
		abfahrt.departure &&
		isHeavyMetal(abfahrt.train.transportType)
	) {
		return <Loading type={1} />;
	}

	if (!auslastungQuery.data) {
		return null;
	}

	return <Occupancy auslastung={auslastungQuery.data} />;
};
