import { cancelledCss, changedCss } from 'client/util/cssUtils';
import AbfahrtenConfigContainer from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import Auslastung from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import CheckInLink from 'client/Common/Components/CheckInLink';
import DetailsLink from 'client/Common/Components/Details/DetailsLink';
import styled from 'styled-components/macro';
import Substitute from './Substitute';
import type { Abfahrt } from 'types/iris';

const Wrap = styled.div`
  flex: 1;
  font-size: 3em;
  max-width: 5em;
  display: flex;
  flex-direction: column;
`;

const Links = styled.div`
  font-size: 0.6em;
  display: flex;
  flex-direction: column;
`;

const Cancelled = styled.span`
  ${cancelledCss};
  ${changedCss};
`;

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
  lineAndNumber: boolean;
}

const Start = ({ abfahrt, detail, lineAndNumber }: Props) => {
  const urlPrefix = AbfahrtenConfigContainer.useContainer().urlPrefix;

  return (
    <Wrap data-testid="abfahrtStart">
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <span>
          {abfahrt.train.type} {abfahrt.train.number}
        </span>
      )}
      {detail && (
        <Links>
          <CheckInLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            station={abfahrt.currentStation}
          />
          <DetailsLink
            urlPrefix={urlPrefix}
            train={abfahrt.train}
            stationId={abfahrt.currentStation.id}
            initialDeparture={abfahrt.initialDeparture}
          />
        </Links>
      )}
      {abfahrt.cancelled && <Cancelled>Zugausfall</Cancelled>}
      {abfahrt.substitute && abfahrt.ref && (
        <Substitute substitute={abfahrt.ref} />
      )}
      {detail && abfahrt.auslastung && <Auslastung abfahrt={abfahrt} />}
    </Wrap>
  );
};

export default Start;
