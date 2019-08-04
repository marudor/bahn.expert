import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@material-ui/core';
import { useRouter } from 'useRouter';
import NavigationContext from './Navigation/NavigationContext';
import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  children: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
const Zugsuche = ({ children }: Props) => {
  const { history } = useRouter();
  const { toggleDrawer } = useContext(NavigationContext);
  const [open, setOpen] = useState(false);
  const [zug, setZug] = useState('');
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
        history.push(`/details/${zug}`);
        toggleModal(e);
        toggleDrawer();
      }
    },
    [zug, history, toggleModal, toggleDrawer]
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
