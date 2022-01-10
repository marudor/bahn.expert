import { Dialog, DialogContent, DialogTitle, styled } from '@mui/material';
import { useCallback, useState } from 'react';
import type { FC, ReactElement, SyntheticEvent } from 'react';

const Title = styled(DialogTitle)`
  font-size: 2.2em;
  font-weight: bold;
`;

interface Props {
  children: (toggle: (e: SyntheticEvent) => void) => ReactElement;
}

export const Disclaimer: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleModal = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen((o) => !o);
  }, []);

  return (
    <>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={toggleModal}
        data-testid="trainRunDisclaimer"
      >
        <Title>Informationen</Title>
        <DialogContent>
          <h3>Hinweise</h3>
          <ul>
            <li>
              Dies ist ein komplexes Feature. Ich biete es hier an werde aber
              keinen Support bieten bei Fragen zur Nutzung.
            </li>
            <li>
              Identifier sind ein von mir erdachte Unterscheidung von Baureihen.
              So ist ein Zug mit identifier 412.7 eine Baureihe 412 mit 7 Wagen.
              412.13 entsprechend 13. BR412 ohne identifier sind die "standard"
              12 teiligen.
            </li>
          </ul>
          <h3>Offene Probleme</h3>
          <ul>
            <li>
              Start/Ziel sind nicht immer korrekt. Züge die an bestimmten Tagen
              verkürzt fahren werden teilweise nicht korrekt angezeigt. Bitte
              prüft über die Details ob der Zug wirklich wie hier angegeben
              fährt
            </li>
            <li>
              Die Redesign Erkennung für BR403 (403.R) und BR406 (406.R) ist
              teilweise statisch. Die sind definitiv nicht 100% up to date. Es
              können auch nicht als redesign ausgewiesene Züge redesigned sein.
            </li>
          </ul>
        </DialogContent>
      </Dialog>
      {children(toggleModal)}
    </>
  );
};
