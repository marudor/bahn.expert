import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import { Stack, styled } from '@mui/material';
import type { ComponentProps, FC } from 'react';
import type { RouteAuslastung } from '@/types/routing';

const Container = styled('div')<{ oneLine?: boolean }>(
  {
    fontSize: '.75em',
    display: 'flex',
  },
  ({ oneLine }) =>
    !oneLine && {
      flexDirection: 'column',
    },
);

const Seperator = styled('span')`
  margin: 0 0.25em;
`;

export interface Props extends ComponentProps<'div'> {
  auslastung: RouteAuslastung;
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
      <Stack direction="row" marginLeft=".2em" component="span">
        <div data-testid="first">
          1. <SingleAuslastungsDisplay auslastung={auslastung.first} />
        </div>
        <Seperator>|</Seperator>
        <div data-testid="second">
          2. <SingleAuslastungsDisplay auslastung={auslastung.second} />
        </div>
      </Stack>
    </Container>
  );
};
