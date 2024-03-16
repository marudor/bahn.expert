import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { Loading } from '@/client/Common/Components/Loading';
import { styled } from '@mui/material';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAuslastung } from '@/client/Abfahrten/provider/AuslastungsProvider';
import type { FC } from 'react';

const Occupancy = styled(AuslastungsDisplay)`
  margin-top: 0.2em;
`;

export const Auslastung: FC = () => {
  const { abfahrt } = useAbfahrt();
  const { getAuslastung } = useAuslastung();

  const auslastung = getAuslastung(abfahrt);

  const trainNumber = Number.parseInt(abfahrt.train.number);
  if (auslastung === undefined && trainNumber < 3000 && abfahrt.departure) {
    return <Loading type={1} />;
  }

  if (!auslastung) {
    return null;
  }

  return <Occupancy auslastung={auslastung} />;
};
