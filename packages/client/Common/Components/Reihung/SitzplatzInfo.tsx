import { Dialog, DialogContent } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { SyntheticEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import type { AdditionalFahrzeugInfo } from 'types/reihung';

const Wrap = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

const Textline = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  additionalInfo: AdditionalFahrzeugInfo;
  wagenordnungsnummer: string;
}

export const SitzplatzInfo = ({
  additionalInfo,
  wagenordnungsnummer,
}: Props) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((oldOpen) => !oldOpen);
  }, []);

  if (!additionalInfo.comfortSeats && !additionalInfo.disabledSeats) {
    return null;
  }

  return (
    <>
      <Wrap data-testid="sitzplatzinfoToggle" onClick={toggle}>
        Plätze
      </Wrap>
      <Dialog fullWidth open={open} onClose={toggle} onClick={stopPropagation}>
        <DialogContent>
          <h3>Sitzplätze Wagen {wagenordnungsnummer}</h3>
          {additionalInfo.comfortSeats && (
            <Textline data-testid="sitzplatzinfoComfort">
              <span>Comfort:</span>
              <span>{additionalInfo.comfortSeats}</span>
            </Textline>
          )}
          {additionalInfo.disabledSeats && (
            <Textline data-testid="sitzplatzinfoDisabled">
              <span>Schwerbehindert:</span>
              <span>{additionalInfo.disabledSeats}</span>
            </Textline>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
