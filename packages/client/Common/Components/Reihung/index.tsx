import { CommonConfigContainer } from 'client/Common/container/CommonConfigContainer';
import { Explain } from './Explain';
import { Formation } from 'types/reihung';
import { Gruppe } from './Gruppe';
import { Loading } from 'client/Common/Components/Loading';
import { ReihungContainer } from 'client/Common/container/ReihungContainer';
import { Sektor } from './Sektor';
import { useEffect } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  overflow-x: auto;
`;

const Main = styled.div<{
  reihung: Formation;
  fahrzeugGruppe: boolean;
  showUIC: boolean;
}>`
  min-width: 70em;
  overflow: hidden;
  position: relative;
  font-size: 170%;
  margin-bottom: 1em;
  margin-right: 0.3em;
  height: ${({ fahrzeugGruppe, reihung, showUIC }) => {
    let height = 8;
    if (fahrzeugGruppe) height += 1;
    if (showUIC) height += 1;
    if (reihung.differentZugnummer) height += 1;
    if (reihung.differentDestination) height += 1;
    if (reihung.allFahrzeuggruppe.find((g) => g.br && g.br.showBRInfo))
      height += 1;
    if (reihung.allFahrzeuggruppe.some((g) => g.name)) {
      height += 1;
    }
    return `${height}em`;
  }};
`;

const Sektoren = styled.div`
  position: relative;
`;

const ReihungWrap = styled.div`
  position: relative;
  margin-top: 1.3em;
  height: 100%;
`;

const Plan = styled.span`
  position: absolute;
  bottom: 1.5em;
`;

const Richtung = styled.span<{ reihung: Formation }>`
  background-color: ${({ theme }) => theme.palette.text.primary};
  width: 50%;
  height: 2px;
  position: absolute;
  left: 50%;
  bottom: 0.5em;
  z-index: 10;
  transform: ${({ reihung }) =>
    reihung.realFahrtrichtung
      ? 'translateX(-50%)'
      : 'rotate(180deg) translateX(50%)'};
  ::after {
    border: solid ${({ theme }) => theme.palette.text.primary};
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    content: ' ';
    transform: rotate(135deg);
    position: absolute;
    top: -3px;
  }
`;

interface Props {
  className?: string;
  trainNumber: string;
  fallbackTrainNumbers?: string[];
  currentStation: string;
  scheduledDeparture: number;
  loadHidden?: boolean;
  withLegend?: boolean;
}

export const Reihung = ({
  className,
  currentStation,
  scheduledDeparture,
  trainNumber,
  loadHidden,
  fallbackTrainNumbers,
}: Props) => {
  const { reihungen, getReihung } = ReihungContainer.useContainer();
  const {
    fahrzeugGruppe,
    showUIC,
    zoomReihung,
  } = CommonConfigContainer.useContainer().config;
  const reihung = reihungen[trainNumber + currentStation + scheduledDeparture];

  useEffect(() => {
    if (reihung === undefined) {
      getReihung(
        trainNumber,
        currentStation,
        scheduledDeparture,
        fallbackTrainNumbers
      );
    }
  }, [
    currentStation,
    fallbackTrainNumbers,
    getReihung,
    reihung,
    scheduledDeparture,
    trainNumber,
  ]);

  if (reihung === null || (!reihung && loadHidden)) {
    return null;
  }
  if (reihung === undefined) {
    return <Loading type={1} />;
  }

  const correctLeft = zoomReihung ? reihung.startPercentage : 0;
  const scale = zoomReihung ? reihung.scale : 1;
  const differentZugnummer = reihung.differentZugnummer;

  return (
    <Wrap className={className} data-testid="reihung">
      <Main showUIC={showUIC} fahrzeugGruppe={fahrzeugGruppe} reihung={reihung}>
        <Sektoren>
          {reihung.halt.allSektor.map((s) => (
            <Sektor
              correctLeft={correctLeft}
              scale={scale}
              key={s.sektorbezeichnung}
              sektor={s}
            />
          ))}
        </Sektoren>
        <ReihungWrap>
          {reihung.allFahrzeuggruppe.map((g) => (
            <Gruppe
              showGruppenZugnummer={differentZugnummer}
              showUIC={showUIC}
              originalTrainNumber={trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={correctLeft}
              scale={scale}
              type={reihung.zuggattung}
              showDestination={
                reihung.differentDestination && g.allFahrzeug.length > 1
              }
              key={g.fahrzeuggruppebezeichnung}
              gruppe={g}
            />
          ))}
        </ReihungWrap>
        <Explain />
        {!reihung.isRealtime && <Plan>Plandaten</Plan>}
        <Richtung reihung={reihung} />
      </Main>
    </Wrap>
  );
};
// eslint-disable-next-line import/no-default-export
export default Reihung;
