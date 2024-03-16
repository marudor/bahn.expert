/* eslint-disable no-process-env */
import { DirectionOfTravel } from '@/client/Common/Components/CoachSequence/DirectionOfTravel';
import { Explain } from './Explain';
import { Group } from './Group';
import { Loading } from '@/client/Common/Components/Loading';
import { Sektor } from './Sektor';
import { sequenceId } from '@/client/Common/provider/CoachSequenceProvider';
import { styled } from '@mui/material';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useEffect, useMemo } from 'react';
import {
  useSequences,
  useSequencesActions,
} from '@/client/Common/provider/CoachSequenceProvider';
import type { FallbackTrainsForCoachSequence } from '@/client/Common/provider/CoachSequenceProvider';
import type { FC } from 'react';

const ContainerWrap = styled('div')`
  overflow-x: auto;
`;

const Container = styled('div')`
  min-width: 80em;
  overflow: hidden;
  position: relative;
  font-size: 170%;
  margin-bottom: 1em;
  margin-right: 0.3em;
`;

const Sectors = styled('div')`
  position: relative;
`;

const Sequence = styled('div')`
  position: relative;
  margin-top: 1.3em;
  height: 100%;
`;

const PlannedOnlyIndicator = styled('span')`
  position: absolute;
  bottom: 1.5em;
`;

interface Props {
  className?: string;
  trainNumber: string;
  trainCategory?: string;
  fallbackWings?: FallbackTrainsForCoachSequence[];
  currentEvaNumber: string;
  scheduledDeparture: Date;
  initialDeparture?: Date;
  administration?: string;
  withLegend?: boolean;
  loadHidden?: boolean;
  lastArrivalEva?: string;
}

const Source: FC<{
  source: string;
}> = ({ source }) => {
  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return <span> ({source})</span>;
};

export const CoachSequence: FC<Props> = ({
  className,
  currentEvaNumber,
  scheduledDeparture,
  trainNumber,
  initialDeparture,
  fallbackWings: fallback,
  trainCategory,
  administration,
  loadHidden,
  lastArrivalEva,
}) => {
  const sequences = useSequences();
  const { getSequences } = useSequencesActions();
  const { fahrzeugGruppe, showUIC, showCoachType } = useCommonConfig();
  const sequence =
    sequences[sequenceId(trainNumber, currentEvaNumber, scheduledDeparture)];
  const trainNumberNumber = Number.parseInt(trainNumber);

  useEffect(() => {
    if (sequence === undefined) {
      void getSequences(
        trainNumber,
        currentEvaNumber,
        scheduledDeparture,
        initialDeparture,
        fallback,
        trainCategory,
        administration,
        lastArrivalEva,
      );
    }
  }, [
    currentEvaNumber,
    fallback,
    getSequences,
    initialDeparture,
    sequence,
    scheduledDeparture,
    trainNumber,
    trainCategory,
    administration,
    lastArrivalEva,
  ]);

  const [scale, startPercent] = useMemo(() => {
    if (!sequence) return [1, 0];
    const coaches = sequence.sequence.groups.flatMap((g) => g.coaches);
    const endPercent = Math.max(...coaches.map((c) => c.position.endPercent));
    const startPercent = Math.min(
      ...coaches.map((c) => c.position.startPercent),
    );
    return [100 / (endPercent - startPercent), startPercent];
  }, [sequence]);

  const mainStyle = useMemo(() => {
    if (!sequence) return {};
    let height = 6.5;
    if (fahrzeugGruppe) height += 1;
    if (showUIC) height += 1;
    if (showCoachType) height += 1;
    if (sequence.multipleDestinations) height += 1;
    if (sequence.multipleTrainNumbers) height += 1;

    let withName = false;
    let withBR = false;
    let withSeats = false;
    for (const g of sequence.sequence.groups) {
      if (g.trainName) withName = true;
      if (g.baureihe) withBR = true;
      for (const c of g.coaches) {
        if (c.seats) withSeats = true;
      }
    }

    if (withName) height += 1;
    if (withBR) height += 1;
    if (withSeats) height += 1;

    return {
      height: `${height}em`,
    };
  }, [fahrzeugGruppe, showUIC, sequence, showCoachType]);

  if (
    sequence === null ||
    (!sequence && (loadHidden || trainNumberNumber > 3000))
  ) {
    return null;
  }
  if (sequence === undefined) {
    return <Loading type={1} />;
  }

  return (
    <ContainerWrap className={className} data-testid="coachSequence">
      <Container style={mainStyle}>
        <Sectors>
          {sequence.stop.sectors.map((s) => (
            <Sektor
              correctLeft={startPercent}
              scale={scale}
              key={s.name}
              sector={s}
            />
          ))}
        </Sectors>
        <Sequence>
          {sequence.sequence.groups.map((g, i) => (
            <Group
              showCoachType={showCoachType}
              showUIC={showUIC}
              originalTrainNumber={trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={startPercent}
              scale={scale}
              type={sequence.product.type}
              showDestination={
                sequence.multipleDestinations && g.coaches.length > 1
              }
              scheduledDeparture={scheduledDeparture}
              showGruppenZugnummer={sequence.multipleTrainNumbers}
              gruppe={g}
              key={i}
            />
          ))}
        </Sequence>
        <Explain />
        {(!sequence.isRealtime || process.env.NODE_ENV !== 'production') && (
          <PlannedOnlyIndicator>
            {!sequence.isRealtime && 'Plandaten'}
            <Source source={sequence.source} />
          </PlannedOnlyIndicator>
        )}
        {sequence.direction != null && (
          <DirectionOfTravel reversed={!sequence.direction} />
        )}
      </Container>
    </ContainerWrap>
  );
};
// eslint-disable-next-line import/no-default-export
export default CoachSequence;
