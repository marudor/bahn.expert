import { useEffect } from 'react';
import AuslastungContainer from 'client/Abfahrten/container/AuslastungContainer';
import AuslastungsDisplay from 'client/Common/Components/AuslastungsDisplay';
import Loading from 'client/Common/Components/Loading';
import type { Abfahrt } from 'types/iris';

interface Props {
  abfahrt: Abfahrt;
}

const Auslastung = ({ abfahrt }: Props) => {
  const { auslastungen, getAuslastung } = AuslastungContainer.useContainer();
  const auslastung =
    auslastungen[
      `${abfahrt.currentStation.title}/${abfahrt.destination}/${abfahrt.train.number}`
    ];

  useEffect(() => {
    if (auslastung === undefined && abfahrt.departure) {
      getAuslastung(
        abfahrt.train.number,
        abfahrt.currentStation.title,
        abfahrt.destination,
        abfahrt.departure.scheduledTime
      );
    }
  }, [abfahrt, auslastung, getAuslastung]);

  if (auslastung === null) {
    return null;
  }

  if (auslastung === undefined) {
    return <Loading type={1} />;
  }

  return <AuslastungsDisplay auslastung={auslastung} />;
};

export default Auslastung;
