import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { RouteStop } from '@/types/routing';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	margin: '0.65em',
	padding: '0.65em',
	border: `1px ${theme.vars.palette.text.primary} solid`,
}));

interface Props {
	stops: RouteStop[];
}

export const TravelsWithSummary: FC<Props> = ({ stops }) => {
	const travelsWithEntries = stops.flatMap(
		(s) =>
			s.joinsWith?.map((t) => ({
				...t,
				stop: s,
			})) || [],
	);

	if (!travelsWithEntries.length) {
		return null;
	}

	return (
		<Container>
			{travelsWithEntries.map((t) => (
				<span key={t.journeyID}>
					Verkehrt von {t.stop.station.name} bis{' '}
					{t.separationAt?.name ||
						t.differingDestination?.name ||
						t.destination.name}{' '}
					vereint mit <TransportName transport={t} />
				</span>
			))}
		</Container>
	);
};
