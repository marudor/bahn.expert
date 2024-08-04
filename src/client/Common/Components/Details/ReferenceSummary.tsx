import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { RouteStop } from '@/types/routing';
import { styled } from '@mui/material';
import { type FC, useMemo } from 'react';

const SummaryContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	margin: '0.65em',
	padding: '0.65em',
	border: `1px ${theme.vars.palette.text.primary} solid`,
}));

interface Props {
	stops: RouteStop[];
}

export const ReferenceSummary: FC<Props> = ({ stops }) => {
	const replacedBy = useMemo(
		() =>
			stops
				.flatMap((s) =>
					s.replacedBy?.map((t) => ({
						...t,
						stop: s,
					})),
				)
				.filter(Boolean)
				.map((r) => (
					<span key={`rb-${r.journeyID}`}>
						Wird von {r.stop.station.name} bis{' '}
						{(r.differingDestination || r.destination).name} ersetzt durch{' '}
						<TransportName transport={r} />
					</span>
				)),
		[stops],
	);

	const replacementFor = useMemo(
		() =>
			stops
				.flatMap((s) =>
					s.replacementFor?.map((t) => ({
						...t,
						stop: s,
					})),
				)
				.filter(Boolean)
				.map((r) => (
					<span key={`rf-${r.journeyID}`}>
						Ersetzt von {r.stop.station.name} bis{' '}
						{(r.differingDestination || r.destination).name}{' '}
						<TransportName transport={r} />
					</span>
				)),
		[stops],
	);

	const travelsWith = useMemo(
		() =>
			stops
				.flatMap((s) =>
					s.joinsWith?.map((t) => ({
						...t,
						stop: s,
					})),
				)
				.filter(Boolean)
				.map((t) => (
					<span key={`tw-${t.journeyID}`}>
						Verkehrt von {t.stop.station.name} bis{' '}
						{t.separationAt?.name ||
							t.differingDestination?.name ||
							t.destination.name}{' '}
						vereint mit <TransportName transport={t} />
					</span>
				)),
		[stops],
	);

	if (!replacedBy.length && !replacementFor.length && !travelsWith.length) {
		return null;
	}

	return (
		<SummaryContainer>
			{replacedBy}
			{replacementFor}
			{travelsWith}
		</SummaryContainer>
	);
};
