import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { Loading } from '@/client/Common/Components/Loading';
import { trpc } from '@/client/RPC';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Occupancy = styled(AuslastungsDisplay)`
  margin-top: 0.2em;
`;

export const Auslastung: FC = () => {
	const { abfahrt } = useAbfahrt();
	const auslastungQuery = trpc.hafas.occupancy.useQuery({
		start: abfahrt.currentStopPlace.name,
		destination: abfahrt.destination,
		trainNumber: abfahrt.train.number,
		plannedDepartureTime: abfahrt.departure?.scheduledTime,
		stopEva: abfahrt.currentStopPlace.evaNumber,
	});

	const trainNumber = Number.parseInt(abfahrt.train.number);
	if (auslastungQuery.isLoading && trainNumber < 3000 && abfahrt.departure) {
		return <Loading type={1} />;
	}

	if (!auslastungQuery.data) {
		return null;
	}

	return <Occupancy auslastung={auslastungQuery.data} />;
};
