import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import styled from '@emotion/styled';
import type { ComponentProps, FC } from 'react';
import type { Route$Auslastung } from 'types/routing';

const Container = styled.div<{ oneLine?: boolean }>(
  {
    fontSize: '.75em',
    display: 'flex',
  },
  ({ oneLine }) =>
    !oneLine && {
      flexDirection: 'column',
    },
);

const Seperator = styled.span`
  margin: 0 0.25em;
`;

const EntryContainer = styled.span`
  display: flex;
  margin-left: 0.2em;
`;

export interface Props extends ComponentProps<'div'> {
  auslastung: Route$Auslastung;
  oneLine?: boolean;
}

export const AuslastungsDisplay: FC<Props> = ({
  auslastung,
  oneLine,
  ...rest
}) => {
  if (!auslastung.first && !auslastung.second) {
    return null;
  }
  return (
    <Container oneLine={oneLine} data-testid="auslastungDisplay" {...rest}>
      Auslastung
      <EntryContainer>
        <div data-testid="first">
          1. <SingleAuslastungsDisplay auslastung={auslastung.first} />
        </div>
        <Seperator>|</Seperator>
        <div data-testid="second">
          2. <SingleAuslastungsDisplay auslastung={auslastung.second} />
        </div>
      </EntryContainer>
    </Container>
  );
};
