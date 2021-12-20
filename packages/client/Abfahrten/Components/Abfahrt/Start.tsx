import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { Name } from 'client/Abfahrten/Components/Abfahrt/Name';
import { Substitute } from './Substitute';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenUrlPrefix } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.div`
  flex: 1;
  font-size: 3em;
  max-width: 5em;
  display: flex;
  flex-direction: column;
`;

const Zugausfall = styled.span(({ theme }) => theme.mixins.changed);

const Links = styled.div`
  font-size: 0.6em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Start: FC = () => {
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { abfahrt, detail } = useAbfahrt();

  return (
    <Container data-testid="abfahrtStart">
      <Name />
      {detail && (
        <Links>
          <TravelynxLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            evaNumber={abfahrt.currentStopPlace.evaNumber}
          />
          <DetailsLink
            urlPrefix={urlPrefix}
            train={abfahrt.train}
            evaNumber={abfahrt.currentStopPlace.evaNumber}
            initialDeparture={abfahrt.initialDeparture}
          />
        </Links>
      )}
      {abfahrt.cancelled && (
        <Zugausfall data-testid="zugausfall">Zugausfall</Zugausfall>
      )}
      {abfahrt.substitute && abfahrt.ref && (
        <Substitute substitute={abfahrt.ref} />
      )}
      {detail && <Auslastung />}
    </Container>
  );
};
