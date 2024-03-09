import { Auslastung } from '@/client/Abfahrten/Components/Abfahrt/Auslastung';
import { Name } from '@/client/Abfahrten/Components/Abfahrt/Name';
import { Ref } from './Ref';
import { Stack, styled } from '@mui/material';
import { TravelynxLink } from '@/client/Common/Components/CheckInLink/TravelynxLink';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import type { FC } from 'react';

const Cancelled = styled('span')(({ theme }) => theme.mixins.changed);

const Substituted = Cancelled.withComponent(Ref);

const Links = styled(Stack)`
  font-size: 0.6em;
  align-items: flex-start;
  > a:last-of-type {
    font-size: 1.5em;
  }
`;

export const Start: FC = () => {
  const { abfahrt, detail } = useAbfahrt();

  return (
    <Stack data-testid="abfahrtStart" flex="1" fontSize="3em" maxWidth="5em">
      <Name withLink />
      {detail && abfahrt.train.number !== '0' && (
        <Links>
          <TravelynxLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            evaNumber={abfahrt.currentStopPlace.evaNumber}
          />
        </Links>
      )}
      {!abfahrt.substituted && abfahrt.cancelled && (
        <Cancelled data-testid="cancelled">Fällt aus</Cancelled>
      )}
      {abfahrt.substitute && abfahrt.ref && (
        <Ref reference={abfahrt.ref}>Ersatz für</Ref>
      )}
      {abfahrt.substituted && abfahrt.ref && (
        <Substituted reference={abfahrt.ref}>Ersetzt durch</Substituted>
      )}
      {detail && <Auslastung />}
    </Stack>
  );
};
