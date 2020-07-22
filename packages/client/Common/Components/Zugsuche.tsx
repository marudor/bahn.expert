import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { subHours } from 'date-fns';
import { useHistory } from 'react-router';
import NavigationContext from './Navigation/NavigationContext';
import qs from 'qs';
import SearchIcon from '@material-ui/icons/Search';
import stopPropagation from 'client/Common/stopPropagation';
import styled from 'styled-components/macro';
import TodayIcon from '@material-ui/icons/Today';
import TrainIcon from '@material-ui/icons/Train';
import useWebStorage from 'client/useWebStorage';
import ZugsucheAutocomplete from 'client/Common/Components/ZugsucheAutocomplete';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

const Title = styled(DialogTitle)`
  text-align: center;
  padding: 16px 24px 0px 24px;
`;

const Content = styled(DialogContent)`
  min-width: 40%;
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  max-width: 240px;
  margin: 0 auto;
`;

const StyledDatePicker = styled(DatePicker)`
  margin: 20px;
`;

const Icon = styled.a`
  position: absolute;
  right: 20px;
  top: 30px;
`;
const StyledTodayIcon = Icon.withComponent(TodayIcon);
const StyledTrainIcon = Icon.withComponent(TrainIcon);

const ZugInputWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  max-width: 240px;
  margin: 0 auto;
`;

const SearchButton = styled(Button)`
  height: 45px;
  margin: 10px;
  width: 95%;
`;

interface Props {
  children?: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
const Zugsuche = ({ children }: Props) => {
  const history = useHistory();
  const storage = useWebStorage();
  const { toggleDrawer } = useContext(NavigationContext);
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<ParsedJourneyMatchResponse | null>();
  const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
  const toggleModal = useCallback(
    (e) => {
      e.stopPropagation();
      setOpen(!open);
    },
    [open]
  );
  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (match) {
        const link = [
          '',
          'details',
          `${match.train.type} ${match.train.number}`,
        ];

        // istanbul ignore else
        if (date) {
          link.push((+date).toString());
        }
        const routeSettings = storage.get('rconfig');

        link.push(
          qs.stringify(
            {
              profile: routeSettings?.hafasProfile,
              station: match.firstStop.station.id,
            },
            { addQueryPrefix: true }
          )
        );

        history.push(link.join('/'));
        toggleModal(e);
        toggleDrawer();
      }
    },
    [match, date, storage, history, toggleModal, toggleDrawer]
  );

  return (
    <>
      <Dialog
        onClick={stopPropagation}
        maxWidth="xs"
        open={open}
        onClose={toggleModal}
        data-testid="Zugsuche"
      >
        <Title>Zugsuche</Title>
        <Content>
          <form onSubmit={onSubmit}>
            <FormControl fullWidth component="fieldset">
              <DateInputWrapper>
                <StyledDatePicker
                  showTodayButton
                  autoOk
                  label="Datum"
                  value={date}
                  onChange={setDate}
                />
                <StyledTodayIcon />
              </DateInputWrapper>
              <ZugInputWrapper>
                <ZugsucheAutocomplete
                  onChange={setMatch}
                  initialDeparture={date?.getTime()}
                />
                <StyledTrainIcon />
              </ZugInputWrapper>
              <SearchButton
                data-testid="ZugsucheSubmit"
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                Suche
              </SearchButton>
            </FormControl>
          </form>
        </Content>
      </Dialog>
      {children?.(toggleModal)}
    </>
  );
};

export default Zugsuche;
