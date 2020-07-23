import * as React from 'react';
import SingleAuslastungsDisplay from 'client/Common/Components/SingleAuslastungsDisplay';
import styled from 'styled-components/macro';
import type { Route$Auslastung } from 'types/routing';

const Wrap = styled.div`
  display: flex;
  margin-bottom: 0.3em;
`;

const Entry = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.5em;
  align-items: center;
`;

export interface Props {
  auslastung: Route$Auslastung;
}

const AuslastungsDisplay = (props: Props) => {
  const { auslastung } = props;

  return (
    <Wrap data-testid="auslastungDisplay">
      <Entry data-testid="first">
        <span>1</span>
        <SingleAuslastungsDisplay auslastung={auslastung.first} />
      </Entry>
      <Entry data-testid="second">
        <span>2</span>
        <SingleAuslastungsDisplay auslastung={auslastung.second} />
      </Entry>
    </Wrap>
  );
};

export default AuslastungsDisplay;
