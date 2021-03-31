import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { Loading } from 'client/Common/Components/Loading';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useEffect } from 'react';
import { useVRRAuslastung } from 'client/Abfahrten/provider/AuslastungsProvider';
import type { FC } from 'react';

export const VRRAuslastung: FC = () => {
  const { abfahrt } = useAbfahrt();
  const { fetchVRRAuslastung, getVRRAuslastung } = useVRRAuslastung();
  const auslastung = getVRRAuslastung(
    abfahrt.currentStopPlace.evaNumber,
    abfahrt.train.number,
  );
  useEffect(() => {
    if (auslastung === undefined && abfahrt.departure) {
      void fetchVRRAuslastung(abfahrt.currentStopPlace.evaNumber);
    }
  }, [abfahrt, auslastung, fetchVRRAuslastung]);

  if (auslastung === undefined && abfahrt.departure) {
    return <Loading type={1} />;
  }
  if (!auslastung) return null;

  return <AuslastungsDisplay auslastung={auslastung} />;
};
