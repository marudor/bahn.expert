/* eslint-disable react/no-unescaped-entities */
import { BRInfo } from '@/client/Common/Components/CoachSequence/BRInfo';
import { Coach } from './Coach';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { journeyNumberFind } from '@/client/Common/service/details';
import { PrideStripe } from '@/client/Common/Components/CoachSequence/Stripes/PrideStripe';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import type { CoachSequenceGroup } from '@/types/coachSequence';
import type { FC } from 'react';
import type { InheritedProps } from './Coach';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';

const Bezeichnung = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 2.5em;
`;

interface Props extends InheritedProps {
  gruppe: CoachSequenceGroup;
  showDestination?: boolean;
  showGruppenZugnummer?: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
  showUIC: boolean;
  showCoachType: boolean;
  scheduledDeparture: Date;
}

const RPFRegex = /(RP)(F\d)(\d{5})/;

const prideTZName = 'ICE0304';

const ClickableTrainLink: FC<{
  type: string;
  number: string;
  scheduledDeparture: Date;
}> = ({ type, number, scheduledDeparture }) => {
  const [foundJourney, setFoundJourney] =
    useState<ParsedJourneyMatchResponse>();
  useEffect(() => {
    void journeyNumberFind(
      Number.parseInt(number),
      scheduledDeparture,
      undefined,
      undefined,
      undefined,
      3,
    ).then((journeys) => {
      const relevantJourney = journeys.filter((j) => j.train.type === type);
      if (relevantJourney.length) {
        setFoundJourney(relevantJourney[0]);
      }
    });
  }, [number, scheduledDeparture, type]);

  if (foundJourney) {
    return (
      <DetailsLink
        train={{
          type,
          number,
        }}
        initialDeparture={scheduledDeparture}
        journeyId={
          foundJourney.jid.includes('-') ? foundJourney.jid : undefined
        }
        jid={foundJourney.jid.includes('|') ? foundJourney.jid : undefined}
      >
        {type} {number}
      </DetailsLink>
    );
  }

  return (
    <span>
      {type} {number}
    </span>
  );
};

export const Group: FC<Props> = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  scheduledDeparture,
  ...rest
}) => {
  const gruppenPos = useMemo(() => {
    const groupStart = Math.min(
      ...gruppe.coaches.map((c) => c.position.startPercent),
    );
    const groupEnd = Math.max(
      ...gruppe.coaches.map((c) => c.position.endPercent),
    );
    return {
      left: `${(groupStart - rest.correctLeft) * rest.scale}%`,
      width: `${(groupEnd - groupStart) * rest.scale}%`,
    };
  }, [gruppe.coaches, rest.correctLeft, rest.scale]);

  const extraInfoLine = Boolean(
    showFahrzeugGruppe ||
      showGruppenZugnummer ||
      showDestination ||
      gruppe.trainName ||
      gruppe.baureihe,
  );

  const fahrzeuge = useMemo(() => {
    const wrongWing =
      originalTrainNumber !== gruppe.number &&
      gruppe.coaches.some((f) => !f.closed);
    const StripeElement = gruppe.name === prideTZName ? PrideStripe : undefined;
    return gruppe.coaches.map((c) => {
      return (
        <Coach
          {...rest}
          Stripe={StripeElement}
          identifier={gruppe.baureihe?.identifier}
          wrongWing={wrongWing}
          key={`${c.uic}${c.position.startPercent}`}
          fahrzeug={c}
        />
      );
    });
  }, [gruppe, originalTrainNumber, rest]);

  return (
    <>
      {fahrzeuge}
      {extraInfoLine && (
        <Bezeichnung style={gruppenPos}>
          {gruppe.baureihe && <BRInfo br={gruppe.baureihe} />}
          {showGruppenZugnummer && gruppe.number && (
            <ClickableTrainLink
              type={rest.type}
              number={gruppe.number}
              scheduledDeparture={scheduledDeparture}
            />
          )}
          {showDestination && <span>Ziel: {gruppe.destinationName}</span>}
          {gruppe.trainName && <span>Zugname: "{gruppe.trainName}"</span>}
          {showFahrzeugGruppe && (
            <span data-testid="coachSequenceCoachGroup">
              {gruppe.name.replace(RPFRegex, '$1 $2 $3')}
            </span>
          )}
        </Bezeichnung>
      )}
    </>
  );
};
