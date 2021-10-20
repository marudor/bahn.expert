import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useCallback, useState } from 'react';
import type { CoachSequenceCoachSeats } from 'types/coachSequence';
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
  seats?: CoachSequenceCoachSeats;
  identificationNumber?: string;
}

export const SitzplatzInfo: FC<Props> = ({ seats, identificationNumber }) => {
  const classes = useStyles();
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
      <span
        className={classes.wrap}
        data-testid="sitzplatzinfoToggle"
        onClick={toggle}
      >
        Plätze
      </span>
      <Dialog fullWidth open={open} onClose={toggle} onClick={stopPropagation}>
        <DialogContent>
          <h3>Sitzplätze Wagen {identificationNumber}</h3>
          {seats.comfort && (
            <div
              className={classes.textLine}
              data-testid="sitzplatzinfoComfort"
            >
              <span>Comfort:</span>
              <span>{seats.comfort}</span>
            </div>
          )}
          {seats.disabled && (
            <div
              className={classes.textLine}
              data-testid="sitzplatzinfoDisabled"
            >
              <span>Schwerbehindert:</span>
              <span>{seats.disabled}</span>
            </div>
          )}
          {seats.family && (
            <div className={classes.textLine} data-testid="sitzplatzinfoFamily">
              <span>Familienbereich:</span>
              <span>{seats.family}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
