import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';
import { MobileDatePicker } from '@mui/lab';
import { NavigationContext } from './Navigation/NavigationContext';
import { Search, Today, Train } from '@mui/icons-material';
import { stopPropagation } from 'client/Common/stopPropagation';
import { subHours } from 'date-fns';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStorage } from 'client/useStorage';
import { ZugsucheAutocomplete } from 'client/Common/Components/ZugsucheAutocomplete';
import qs from 'qs';
import styled from '@emotion/styled';
import type { FC, ReactElement, SyntheticEvent } from 'react';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

const Title = styled(DialogTitle)`
  text-align: center;
  padding: 16px 24px 0 24px;
`;

const Content = styled(DialogContent)`
  min-width: 40%;
`;

const DateInputField = styled(TextField)`
  margin: 20px;
`;
const TrainIcon = styled(Train)`
  position: absolute;
  right: 20px;
  top: 39px;
`;
const TodayIcon = TrainIcon.withComponent(Today);

const InputContainer = styled.div`
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
export const Zugsuche: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const storage = useStorage();
  const { toggleDrawer } = useContext(NavigationContext);
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<ParsedJourneyMatchResponse | null>();
  const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
  const toggleModal = useCallback(
    (e) => {
      e.stopPropagation();
      setOpen(!open);
    },
    [open],
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
          link.push(date.toISOString());
        }

        link.push(
          qs.stringify(
            {
              profile: storage.get('hafasProfile'),
              station: match.firstStop.station.id,
            },
            { addQueryPrefix: true },
          ),
        );

        navigate(link.join('/'));
        toggleModal(e);
        toggleDrawer();
      }
    },
    [match, date, storage, toggleModal, toggleDrawer],
  );

  return (
    <>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={toggleModal}
        data-testid="Zugsuche"
      >
        <Title onClick={stopPropagation}>Zugsuche</Title>
        <Content onClick={stopPropagation}>
          <form onSubmit={onSubmit}>
            <FormControl fullWidth component="fieldset">
              <InputContainer>
                <MobileDatePicker
                  allowSameDateSelection
                  showTodayButton
                  disableCloseOnSelect={false}
                  renderInput={(props) => <DateInputField {...props} />}
                  label="Datum"
                  value={date}
                  onChange={setDate}
                />
                <TodayIcon />
              </InputContainer>
              <InputContainer>
                <ZugsucheAutocomplete
                  onChange={setMatch}
                  initialDeparture={date || undefined}
                />
                <TrainIcon />
              </InputContainer>
              <SearchButton
                data-testid="ZugsucheSubmit"
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Search />}
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
