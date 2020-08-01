import { Chip, Paper } from '@material-ui/core';
import { format } from 'date-fns';
import { gridStyle } from 'client/Routing/Components/RouteList/Route';
import styled from 'styled-components';

const PaperWrap = styled(Paper)`
  font-size: 0.8em;
  ${gridStyle};
`;

const Date = styled.span`
  grid-area: 1 / 1 / 2 / 5;
  text-align: center;
  margin-bottom: 10px;
`;

const StyledChip = styled(Chip)`
  font-size: 1.4rem;
`;

interface Props {
  date: number;
}

export const RouteHeader = ({ date }: Props) => (
  <PaperWrap square>
    <Date data-testid="headerDate">
      <StyledChip
        size="medium"
        variant="outlined"
        color="secondary"
        label={format(date, 'dd.MM.yyyy')}
      />
    </Date>
    <span>Ab</span>
    <span>An</span>
    <span>Dauer</span>
    <span>Umstiege</span>
  </PaperWrap>
);
