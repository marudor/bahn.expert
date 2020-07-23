import { format } from 'date-fns';
import { gridStyle } from 'client/Routing/Components/RouteList/Route';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components/macro';

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

const RouteHeader = ({ date }: Props) => (
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

export default RouteHeader;
