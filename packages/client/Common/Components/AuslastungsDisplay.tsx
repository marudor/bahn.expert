import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { Route$Auslastung } from 'types/routing';

const Container = styled.div`
  display: flex;
  margin-bottom: 0.3em;
`;

const Entry = styled.div`
  display: flex;
  margin-right: 0.5em;
  align-items: center;
  flex-direction: column;
`;
export interface Props {
  auslastung: Route$Auslastung;
}

export const AuslastungsDisplay: FC<Props> = ({ auslastung }) => {
  return (
    <Container data-testid="auslastungDisplay">
      <Entry data-testid="first">
        <span>1</span>
        <SingleAuslastungsDisplay auslastung={auslastung.first} />
      </Entry>
      <Entry data-testid="second">
        <span>2</span>
        <SingleAuslastungsDisplay auslastung={auslastung.second} />
      </Entry>
    </Container>
  );
};
