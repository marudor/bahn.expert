/* eslint-disable react/no-unescaped-entities */
import { BRInfo } from './BRInfo';
import { Fahrzeug, InheritedProps } from './Fahrzeug';
import { useMemo } from 'react';
import styled from 'styled-components';
import type { Fahrzeuggruppe } from 'types/reihung';

interface Props extends InheritedProps {
  gruppe: Fahrzeuggruppe;
  showDestination?: boolean;
  showGruppenZugnummer?: boolean;
  showFahrzeugGruppe: boolean;
  originalTrainNumber: string;
  showUIC: boolean;
}

const Bezeichnung = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 2.5em;
`;

export const Gruppe = ({
  gruppe,
  showDestination,
  showFahrzeugGruppe,
  showGruppenZugnummer,
  originalTrainNumber,
  ...rest
}: Props) => {
  const gruppenPos = {
    left: `${(gruppe.startPercentage - rest.correctLeft) * rest.scale}%`,
    width: `${(gruppe.endPercentage - gruppe.startPercentage) * rest.scale}%`,
  };

  let currentBottom = 2.5;

  if (showFahrzeugGruppe) currentBottom += 1;
  const destinationPos = {
    ...gruppenPos,
    bottom: `${currentBottom}em`,
  };

  const showBR = gruppe.br && gruppe.br.showBRInfo;
  const extraInfoLine = Boolean(showDestination || showBR);

  if (extraInfoLine) currentBottom += 1;
  if (rest.showUIC) currentBottom += 1;
  if (showGruppenZugnummer && gruppe.verkehrlichezugnummer) currentBottom += 1;

  const fahrzeuge = useMemo(
    () =>
      gruppe.allFahrzeug.map((f) => {
        return (
          <Fahrzeug
            {...rest}
            wrongWing={originalTrainNumber !== gruppe.verkehrlichezugnummer}
            key={`${f.fahrzeugnummer}${f.positioningruppe}`}
            fahrzeug={f}
          />
        );
      }),
    [gruppe, originalTrainNumber, rest]
  );

  return (
    <>
      {fahrzeuge}
      {extraInfoLine && (
        <Bezeichnung style={destinationPos}>
          {showBR && gruppe.br && <BRInfo br={gruppe.br} />}
          {showGruppenZugnummer && gruppe.verkehrlichezugnummer && (
            <span>
              {rest.type} {gruppe.verkehrlichezugnummer}
            </span>
          )}
          {showDestination && (
            <span>Ziel: {gruppe.zielbetriebsstellename}</span>
          )}
          {gruppe.name && <span>Zugname: "{gruppe.name}"</span>}
        </Bezeichnung>
      )}

      {showFahrzeugGruppe && (
        <Bezeichnung data-testid="reihungFahrzeugGruppe" style={gruppenPos}>
          {gruppe.fahrzeuggruppebezeichnung}
        </Bezeichnung>
      )}
    </>
  );
};
