import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  makeStyles,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { NavigationContext } from './Navigation/NavigationContext';
import { Search, Today, Train } from '@material-ui/icons';
import { stopPropagation } from 'client/Common/stopPropagation';
import { subHours } from 'date-fns';
import { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { useStorage } from 'client/useStorage';
import { ZugsucheAutocomplete } from 'client/Common/Components/ZugsucheAutocomplete';
import qs from 'qs';
import type { FC, ReactElement, SyntheticEvent } from 'react';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
    padding: '16px 24px 0 24px',
  },
  content: {
    minWidth: '40%',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 240,
    margin: '0 auto',
  },
  datePicker: {
    margin: 20,
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 39,
  },
  searchButton: {
    height: 45,
    margin: 10,
    width: '95%',
  },
});

interface Props {
  children?: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
export const Zugsuche: FC<Props> = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
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
          link.push((+date).toString());
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

        history.push(link.join('/'));
        toggleModal(e);
        toggleDrawer();
      }
    },
    [match, date, storage, history, toggleModal, toggleDrawer],
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
        <DialogTitle className={classes.title}>Zugsuche</DialogTitle>
        <DialogContent className={classes.content}>
          <form onSubmit={onSubmit}>
            <FormControl fullWidth component="fieldset">
              <div className={classes.inputWrapper}>
                <DatePicker
                  className={classes.datePicker}
                  showTodayButton
                  autoOk
                  label="Datum"
                  value={date}
                  onChange={setDate}
                />
                <Today className={classes.icon} />
              </div>
              <div className={classes.inputWrapper}>
                <ZugsucheAutocomplete
                  onChange={setMatch}
                  initialDeparture={date || undefined}
                />
                <Train className={classes.icon} />
              </div>
              <Button
                className={classes.searchButton}
                data-testid="ZugsucheSubmit"
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Search />}
              >
                Suche
              </Button>
            </FormControl>
          </form>
        </DialogContent>
      </Dialog>
      {children?.(toggleModal)}
    </>
  );
};
