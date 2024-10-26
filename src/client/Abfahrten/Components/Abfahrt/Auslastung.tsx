import { useAbfahrt } from '@/client/Abfahrten/provider/AbfahrtProvider';
import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { Loading } from '@/client/Common/Components/Loading';
import { trpc } from '@/client/RPC';
import { isHeavyMetal } from '@/client/utilities';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Occupancy = styled(AuslastungsDisplay)`
  margin-top: 0.2em;
`;

export const Auslastung: FC = () => {
	const { abfahrt } = useAbfahrt();
	const { data: journeyId, isFetching } = trpc.journey.findByNumber.useQuery(
		{
			trainNumber: Number.parseInt(abfahrt.train.number),
			category: abfahrt.train.type,
			initialDepartureDate: abfahrt.initialDeparture,
		},
		{
			select: (r) => r[0].jid,
		},
	);

	const auslastungQuery = trpc.hafas.occupancy.useQuery(
		{
			start: abfahrt.currentStopPlace.name,
			destination: abfahrt.destination,
			trainNumber: abfahrt.train.number,
			plannedDepartureTime: abfahrt.departure?.scheduledTime,
			stopEva: abfahrt.currentStopPlace.evaNumber,
			journeyId,
		},
		{
			enabled: !isFetching,
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
