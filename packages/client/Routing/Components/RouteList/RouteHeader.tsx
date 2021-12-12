import { Chip, Paper } from '@mui/material';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled(Paper)`
  grid-template-columns: 2fr 2fr 2fr 2fr;
  grid-template-rows: 60px 20px;
  display: grid;
  margin-bottom: 0.2em;
  align-items: center;
  font-size: 0.8em;
`;

const DateContainer = styled.span`
  grid-area: 1 / 1 /2 / 5;
  text-align: center;
  margin-bottom: 10px;
`;

const StyledChip = styled(Chip)`
  font-size: 1.4rem;
`;

interface Props {
  date: Date;
}

export const RouteHeader: FC<Props> = ({ date }) => {
  return (
    <Container square>
      <DateContainer data-testid="headerDate">
        <StyledChip
          size="medium"
          variant="outlined"
          color="secondary"
          label={format(date, 'dd.MM.yyyy')}
        />
      </DateContainer>
      <span>Ab</span>
      <span>An</span>
      <span>Dauer</span>
      <span>Umstiege</span>
    </Container>
  );
};
