import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { Loading } from 'client/Common/Components/Loading';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAuslastung } from 'client/Abfahrten/provider/AuslastungsProvider';
import { useEffect } from 'react';
import type { FC } from 'react';

export const Auslastung: FC = () => {
  const { abfahrt } = useAbfahrt();
  const { auslastungen, getAuslastung } = useAuslastung();
  const auslastung =
    auslastungen[
      `${abfahrt.currentStopPlace.name}/${abfahrt.destination}/${abfahrt.train.number}`
    ];

  useEffect(() => {
    if (auslastung === undefined && abfahrt.departure) {
      void getAuslastung(
        abfahrt.train.number,
        abfahrt.currentStopPlace.name,
        abfahrt.destination,
        abfahrt.departure.scheduledTime,
      );
    }
  }, [abfahrt, auslastung, getAuslastung]);

  if (auslastung === undefined && abfahrt.departure) {
    return <Loading type={1} />;
  }

  if (!auslastung) {
    return null;
  }

  return <AuslastungsDisplay auslastung={auslastung} />;
};
