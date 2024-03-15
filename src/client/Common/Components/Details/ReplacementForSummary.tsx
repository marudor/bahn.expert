import { TransportName } from '@/client/Common/Components/Details/TransportName';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { RouteStop } from '@/types/routing';

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '0.65em',
  padding: '0.65em',
  border: `1px ${theme.palette.text.primary} solid`,
}));

interface Props {
  stops: RouteStop[];
}

export const ReplacementForSummary: FC<Props> = ({ stops }) => {
  const replacementForEntries = stops.flatMap(
    (s) =>
      s.startsReplacing?.map((t) => ({
        ...t,
        stop: s,
        stopsReplacing: stops.find(
          (s) =>
            s.stopsReplacing?.find((r) => r.journeyID === t.journeyID) !==
            undefined,
        ),
      })) || [],
  );

  if (!replacementForEntries.length) {
    return null;
  }

  return (
    <Container>
      {replacementForEntries.map((t) => (
        <span key={t.journeyID}>
          Ersetzt von {t.stop.station.name} bis{' '}
          {t.stopsReplacing?.station.name ||
            t.differingDestination?.name ||
            t.destination.name}{' '}
          <TransportName transport={t} />
        </span>
      ))}
    </Container>
  );
};
