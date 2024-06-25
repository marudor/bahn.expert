import { Alert, Snackbar } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorage } from '@/client/useStorage';
import type { FC } from 'react';
import type { SnackbarOrigin } from '@mui/material';

const possibleTexts = [
  'Du bist die Brandmauer gegen Rechts',
  '"Unpolitisch" ist politisch',
  'Die AfD ist die mit Abstand größte Gefahr für unsere Gesellschaft! #AfDVerbotJetzt',
  'Sich an Antifaschismus stören ist so 1933',
  'Dieser Service wird nicht von Faschisten finanziert',
  'Menschenrechte statt rechte Menschen',
  'Kein Mensch ist illegal',
  '"Nie wieder" ist immer, nicht nur alle 4 Jahre beim Kreuzchen machen',
  'Kein Platz für Rassismus',
  'Trans rights are human rights',
  'Trans rights or riot nights',
  'Die Brandmauer ist überall. Auch auf der Drehscheibe!',
  '#EisenbahnerAntifa',
];

const anchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

export const PolitikBanner: FC = () => {
  const storage = useStorage();
  const timesSeen = storage.get('timesPoliticSeenNew') ?? 0;
  const [open, setOpen] = useState(timesSeen < 14);
  useEffect(() => {
    if (Math.random() * 100 < 0.75) {
      storage.remove('timesPoliticSeenNew');
    }
  }, [storage]);
  const setClose = useCallback(() => {
    let timesSeen = storage.get('timesPoliticSeenNew') ?? 0;
    if (typeof timesSeen !== 'number') {
      timesSeen = 0;
    }
    storage.set('timesPoliticSeenNew', timesSeen + 1);
    setOpen(false);
  }, [storage]);
  const selectedText = useMemo(
    () => possibleTexts[Math.floor(Math.random() * possibleTexts.length)],
    [],
  );

  return (
    <Snackbar
      open={open}
      onClick={setClose}
      onClose={setClose}
      autoHideDuration={17500}
      anchorOrigin={anchorOrigin}
    >
      <Alert severity="info" icon={false}>
        {selectedText}
      </Alert>
    </Snackbar>
  );
};
