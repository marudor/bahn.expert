import { Auslastung } from '@/client/Abfahrten/Components/Abfahrt/Auslastung';
import { Name } from '@/client/Abfahrten/Components/Abfahrt/Name';
import { Ref } from './Ref';
import { TravelynxLink } from '@/client/Common/Components/CheckInLink/TravelynxLink';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.div`
  flex: 1;
  font-size: 3em;
  max-width: 5em;
  display: flex;
  flex-direction: column;
`;

const Cancelled = styled.span(({ theme }) => theme.mixins.changed);

const Substituted = Cancelled.withComponent(Ref);

const Links = styled.div`
  font-size: 0.6em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > a:last-of-type {
    font-size: 1.5em;
  }
`;

export const Start: FC = () => {
  const { abfahrt, detail } = useAbfahrt();

  return (
    <Container data-testid="abfahrtStart">
      <Name withLink={detail && abfahrt.train.number !== '0'} />
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
    </Container>
  );
};
