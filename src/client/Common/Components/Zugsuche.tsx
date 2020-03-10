import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import { subHours } from 'date-fns';
import { useHistory } from 'react-router';
import NavigationContext from './Navigation/NavigationContext';
import qs from 'qs';
import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import stopPropagation from 'Common/stopPropagation';
import useStorage from 'shared/hooks/useStorage';
import TodayIcon from '@material-ui/icons/Today';
import TrainIcon from '@material-ui/icons/Train';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './Zugsuche.style';
import ZugsucheAutocomplete from 'Common/Components/ZugsucheAutocomplete';

interface Props {
  children: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
const Zugsuche = ({ children }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const storage = useStorage();
  const { toggleDrawer } = useContext(NavigationContext);
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<ParsedJourneyMatchResponse | null>();
  const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
  const toggleModal = useCallback(
    e => {
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
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={toggleModal}
        data-testid="Zugsuche"
      >
        <DialogTitle className={classes.header}>Zugsuche</DialogTitle>
        <DialogContent className={classes.main}>
          <form onSubmit={onSubmit}>
            <FormControl fullWidth component="fieldset">
              <div className={classes.dateInputWrapper}>
                <DatePicker
                  showTodayButton
                  autoOk
                  label="Datum"
                  value={date}
                  onChange={setDate}
                  className={classes.searchInput}
                />
                <TodayIcon className={classes.inputIcon} />
              </div>
              <div className={classes.zugInputWrapper}>
                <ZugsucheAutocomplete
                  onChange={setMatch}
                  initialDeparture={date?.getTime()}
                />
                <TrainIcon className={classes.inputIcon} />
              </div>
              <Button
                data-testid="ZugsucheSubmit"
                type="submit"
                variant="contained"
                color="primary"
                className={classes.searchButton}
                startIcon={<SearchIcon />}
              >
                Suche
              </Button>
            </FormControl>
          </form>
        </DialogContent>
      </Dialog>
      {children(toggleModal)}
    </>
  );
};

export default Zugsuche;
