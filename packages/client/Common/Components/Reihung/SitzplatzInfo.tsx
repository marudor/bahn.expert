import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useCallback, useState } from 'react';
import type { AdditionalFahrzeugInfo } from 'types/reihung';
import type { FC, SyntheticEvent } from 'react';

const useStyles = makeStyles((theme) => ({
  wrap: {
    color: theme.colors.blue,
    cursor: 'pointer',
  },
  textLine: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

interface Props {
  additionalInfo: AdditionalFahrzeugInfo;
  wagenordnungsnummer: string;
}

export const SitzplatzInfo: FC<Props> = ({
  additionalInfo,
  wagenordnungsnummer,
}) => {
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
        className={classes.wrap}
        data-testid="sitzplatzinfoToggle"
        onClick={toggle}
      >
        Plätze
      </span>
      <Dialog fullWidth open={open} onClose={toggle} onClick={stopPropagation}>
        <DialogContent>
          <h3>Sitzplätze Wagen {wagenordnungsnummer}</h3>
          {additionalInfo.comfortSeats && (
            <div
              className={classes.textLine}
              data-testid="sitzplatzinfoComfort"
            >
              <span>Comfort:</span>
              <span>{additionalInfo.comfortSeats}</span>
            </div>
          )}
          {additionalInfo.disabledSeats && (
            <div
              className={classes.textLine}
              data-testid="sitzplatzinfoDisabled"
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
