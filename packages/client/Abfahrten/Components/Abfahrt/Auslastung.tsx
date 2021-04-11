import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { Loading } from 'client/Common/Components/Loading';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAuslastung } from 'client/Abfahrten/provider/AuslastungsProvider';
import { useEffect, useMemo } from 'react';
import type { FC } from 'react';

export const Auslastung: FC = () => {
  const { abfahrt } = useAbfahrt();
  const {
    getDBAuslastung,
    getVRRAuslastung,
    fetchDBAuslastung,
    fetchVRRAuslastung,
  } = useAuslastung();
  const { getAuslastung, fetchAuslastung } = useMemo(
    () =>
      abfahrt.auslastung
        ? {
            getAuslastung: getDBAuslastung,
            fetchAuslastung: fetchDBAuslastung,
          }
        : {
            getAuslastung: getVRRAuslastung,
            fetchAuslastung: fetchVRRAuslastung,
          },
    [
      abfahrt.auslastung,
      fetchDBAuslastung,
      fetchVRRAuslastung,
      getDBAuslastung,
      getVRRAuslastung,
    ],
  );

  const auslastung = getAuslastung(abfahrt);

  useEffect(() => {
    if (auslastung === undefined && abfahrt.departure) {
      void fetchAuslastung(abfahrt);
    }
  }, [abfahrt, auslastung, fetchAuslastung]);

  if (abfahrt.auslastung && auslastung === undefined) {
    return <Loading type={1} />;
  }

  if (!auslastung) {
    return null;
  }

  return <AuslastungsDisplay auslastung={auslastung} />;
};
