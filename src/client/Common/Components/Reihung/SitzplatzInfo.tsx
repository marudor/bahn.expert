import { Dialog, DialogContent } from '@material-ui/core';
import { SyntheticEvent, useCallback, useState } from 'react';
import useStyles from './SitzplatzInfo.style';
import type { AdditionalFahrzeugInfo } from 'types/reihung';

interface Props {
  additionalInfo: AdditionalFahrzeugInfo;
  wagenordnungsnummer: string;
}

const SitzplatzInfo = ({ additionalInfo, wagenordnungsnummer }: Props) => {
  const classes = useStyles();
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
      <span
        data-testid="sitzplatzinfoToggle"
        className={classes.link}
        onClick={toggle}
      >
        Plätze
      </span>
      <Dialog fullWidth open={open} onClose={toggle} onClick={toggle}>
        <DialogContent>
          <h3>Sitzplätze Wagen {wagenordnungsnummer}</h3>
          {additionalInfo.comfortSeats && (
            <div
              data-testid="sitzplatzinfoComfort"
              className={classes.textLine}
            >
              <span>Comfort:</span>
              <span>{additionalInfo.comfortSeats}</span>
            </div>
          )}
          {additionalInfo.disabledSeats && (
            <div
              data-testid="sitzplatzinfoDisabled"
              className={classes.textLine}
            >
              <span>Schwerbehindert:</span>
              <span>{additionalInfo.disabledSeats}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SitzplatzInfo;
