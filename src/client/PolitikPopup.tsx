import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useCallback, useState } from 'react';
import { useStorage } from '@/client/useStorage';
import type { FC } from 'react';

export const PolitikPopup: FC = () => {
  const storage = useStorage();
  const [open, setOpen] = useState(!storage.get('politicSeen'));
  const close = useCallback(() => {
    storage.set('politicSeen', true);
    setOpen(false);
  }, [storage]);

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Ich bin sauer (Politik)</DialogTitle>
      <DialogContent>
        Wir haben einen Tag nach der Europawahl und ich bin sauer und traurig...
        <br />
        Hiermit in alle AFD Wählenden: <strong>FICKT EUCH!</strong>
        <br />
        Ihr seit die mit Abstand größte Gefahr für unsere Gesellschaft! Verpisst
        euch einfach von bahn.expert - wenn ich könnte würde ich technisch
        verhindern das ihr hier seit!
        <br />
        Das Projekt hier soll eigentlich nur eure Bahnfahrten erleichtern. Aber
        in Zeiten wo eine Partei welche in Teilen gesichert rechtsextrem ist und
        überall ein rechtsextremer Verdachtsfall ist. Und das von unserem
        Verfassungschutz welcher auf dem rechten Auge leider viele Dioptrien
        besitzt...
        <br />
        An alle Menschen die sich gegen rechtsextremismus und fachismus
        einsetzen: Danke euch!
        <br />
        An alle Menschen die eher konservativ sind - aber nicht rechtsextrem
        sind Also Mindestens CDU Wählende zum Beispiel. Wir mögen politisch
        nicht zueinander finden. Aber immerhin fallt ihr nicht auf die Lügen der
        AFD rein!
        <br />
        Das reicht dann auch, so lange ihr eure Settings nicht löscht seht ihr
        das hier nicht wieder.
      </DialogContent>
    </Dialog>
  );
};
