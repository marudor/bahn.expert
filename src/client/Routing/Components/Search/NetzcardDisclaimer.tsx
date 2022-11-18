import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import type { FC } from 'react';

export const NetzcardDisclaimer: FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      scroll="body"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>Netzcard Disclaimer</DialogTitle>
      <DialogContent>
        Dies ist ein experimenteller Filter um möglichst nur Verbindungen zu
        suchen welche mit der Netzcard erlaubt sind.
        <br />
        USE AT YOUR OWN RISK!
        <br />
        Aktuell werden nur EVUs der DB AG berücksichtigt. Die aktuelle Liste
        findet sich hier:{' '}
        <a
          href="https://github.com/marudor/bahn.expert/tree/main/src/server/HAFAS/TripSearch/NetzcardBetreiber.json"
          target="_blank"
          rel="noreferrer"
        >
          NetzcardBetreiber.json
        </a>{' '}
        <br />
        Das bedeutet vor allem das die Ausnahmen für bestimmte Strecken NICHT
        berücksichtigt werden!
      </DialogContent>
    </Dialog>
  );
};
