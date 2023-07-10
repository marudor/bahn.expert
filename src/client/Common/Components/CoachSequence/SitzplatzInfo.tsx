import { Dialog, DialogContent } from '@mui/material';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import type { CoachSequenceCoachSeats } from '@/types/coachSequence';
import type { FC, SyntheticEvent } from 'react';

const OpenText = styled.span(({ theme }) => ({
  color: theme.colors.blue,
  cursor: 'pointer',
}));

const TextLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  seats?: CoachSequenceCoachSeats;
  identificationNumber?: string;
}

export const SitzplatzInfo: FC<Props> = ({ seats, identificationNumber }) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((oldOpen) => !oldOpen);
  }, []);

  if (!seats || (!seats.comfort && !seats.disabled && !seats.family)) {
    return null;
  }

  return (
    <>
      <OpenText data-testid="sitzplatzinfoToggle" onClick={toggle}>
        Plätze
      </OpenText>
      <Dialog fullWidth open={open} onClose={toggle}>
        <DialogContent>
          <h3>Sitzplätze Wagen {identificationNumber}</h3>
          {seats.comfort && (
            <TextLine data-testid="sitzplatzinfoComfort">
              <span>BahnBonus Status:</span>
              <span>{seats.comfort}</span>
            </TextLine>
          )}
          {seats.disabled && (
            <TextLine data-testid="sitzplatzinfoDisabled">
              <span>Schwerbehindert:</span>
              <span>{seats.disabled}</span>
            </TextLine>
          )}
          {seats.family && (
            <TextLine data-testid="sitzplatzinfoFamily">
              <span>Familienbereich:</span>
              <span>{seats.family}</span>
            </TextLine>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
