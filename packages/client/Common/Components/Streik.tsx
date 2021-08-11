import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { useCallback, useState } from 'react';
import type { FC } from 'react';

export const Streik: FC = () => {
  const [open, setOpen] = useState(true);
  const onClick = useCallback(() => setOpen(false), []);
  return (
    <Snackbar open={open}>
      <Alert onClick={onClick} severity="info" icon={false}>
        Grade wird gestreikt. Das hat einfluss auf den Zugverkehr. Volle
        Solidarität mit Streikenden!
      </Alert>
    </Snackbar>
  );
};
