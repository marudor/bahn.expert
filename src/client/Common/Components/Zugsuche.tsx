import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { useRouter } from 'useRouter';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import Train from '@material-ui/icons/Train';

interface Props {
  noIcon?: boolean;
  onClose?: Function;
}
const Zugsuche = ({ noIcon, onClose }: Props) => {
  const { history } = useRouter();
  const [open, setOpen] = useState(false);
  const [zug, setZug] = useState('');
  const toggleModal = useCallback(() => setOpen(!open), [open]);
  const onDialogClose = useCallback(() => {
    toggleModal();
    if (onClose) onClose();
  }, [onClose, toggleModal]);
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
      history.push(`/details/${zug}`);
      onDialogClose();
    },
    [history, zug, onDialogClose]
  );

  return (
    <>
      <Dialog maxWidth="md" open={open} onClose={onDialogClose}>
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
      <MenuItem onClick={toggleModal}>{!noIcon && <Train />} Zugsuche</MenuItem>
    </>
  );
};

export default Zugsuche;
