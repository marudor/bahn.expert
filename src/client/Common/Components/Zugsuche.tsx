import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { subHours } from 'date-fns';
import { useHistory } from 'react-router';
import NavigationContext from './Navigation/NavigationContext';
import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import stopPropagation from 'Common/stopPropagation';
import useCookies from 'Common/useCookies';

interface Props {
  children: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
const Zugsuche = ({ children }: Props) => {
  const history = useHistory();
  const cookies = useCookies();
  const { toggleDrawer } = useContext(NavigationContext);
  const [open, setOpen] = useState(false);
  const [zug, setZug] = useState('');
  const [date, setDate] = useState<Date | null>(subHours(new Date(), 1));
  const toggleModal = useCallback(
    e => {
      e.stopPropagation();
      setOpen(!open);
    },
    [open]
  );
  const handleZugChange = useCallback(
    (
      e: SyntheticEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setZug(e.currentTarget.value);
    },
    []
  );
  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (zug) {
        const link = ['', 'details', zug];

        // istanbul ignore else
        if (date) {
          link.push((+date).toString());
        }
        const routeSettings = cookies.get('rconfig');

        if (
          routeSettings &&
          routeSettings.hafasProfile &&
          (routeSettings.hafasProfile === 'db' ||
            routeSettings.hafasProfile === 'oebb')
        ) {
          link.push(`?profile=${routeSettings.hafasProfile}`);
        }

        history.push(link.join('/'));
        toggleModal(e);
        toggleDrawer();
      }
    },
    [zug, date, cookies, history, toggleModal, toggleDrawer]
  );

  return (
    <>
      <Dialog
        onClick={stopPropagation}
        maxWidth="md"
        open={open}
        onClose={toggleModal}
        data-testid="Zugsuche"
      >
        <DialogTitle>Zugsuche</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <FormControl component="fieldset">
              <TextField
                inputProps={{
                  'data-testid': 'ZugsucheInput',
                }}
                autoFocus
                placeholder="z.B. ICE 71"
                value={zug}
                onChange={handleZugChange}
              />
              <DatePicker
                autoOk
                label="Datum"
                value={date}
                onChange={setDate}
              />
              <Button data-testid="ZugsucheSubmit" type="submit">
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
