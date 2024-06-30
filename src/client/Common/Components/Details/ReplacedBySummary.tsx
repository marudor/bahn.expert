import { styled } from '@mui/material';
import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { FC } from 'react';
import type { RouteStop } from '@/types/routing';

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

export const ReplacedBySummary: FC<Props> = ({ stops }) => {
  const travelsWithEntries = stops.flatMap(
    (s) =>
      s.joinsWith?.map((t) => ({
        ...t,
        stop: s,
        stopsBeingReplacedBy: stops.find(
          (s) =>
            s.stopsBeingReplacedBy?.find((r) => r.journeyID === t.journeyID) !==
            undefined,
        ),
      })) || [],
  );

  if (!travelsWithEntries.length) {
    return null;
  }

  return (
    <Container>
      {travelsWithEntries.map((t) => (
        <span key={t.journeyID}>
          Wird von {t.stop.station.name} bis{' '}
          {t.stopsBeingReplacedBy?.station.name ||
            t.differingDestination?.name ||
            t.destination.name}{' '}
          durch <TransportName transport={t} /> ersetzt
        </span>
      ))}
    </Container>
  );
};
