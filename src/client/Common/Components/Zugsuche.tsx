import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@material-ui/core';
import { useRouter } from 'useRouter';
import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useState,
} from 'react';

interface Props {
  children: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}
const Zugsuche = ({ children }: Props) => {
  const { history } = useRouter();
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
      }
    },
    [history, zug, toggleModal]
  );

  return (
    <>
      <Dialog maxWidth="md" open={open} onClose={toggleModal}>
        <DialogTitle>Zugsuche</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <FormControl component="fieldset">
              <TextField
                autoFocus
                placeholder="z.B. ICE 71"
                value={zug}
                onChange={handleZugChange}
              />
              <Button type="submit">Suche</Button>
            </FormControl>
          </form>
        </DialogContent>
      </Dialog>
      {children(toggleModal)}
    </>
  );
};

export default Zugsuche;
