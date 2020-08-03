import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import { icons } from './Fahrzeug';
import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import { stopPropagation } from 'client/Common/stopPropagation';
import { SyntheticEvent, useCallback, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  legende: {
    color: theme.colors.blue,
    position: 'absolute',
    bottom: '.5em',
    left: 0,
    cursor: 'pointer',
  },
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '16em',
    marginBottom: '.2em',
    '& > svg': {
      marginRight: '1em',
    },
    '& > span': {
      fontSize: '1em',
      marginRight: '1em',
    },
  },
  comfort: {
    width: '1em',
    height: '1em',
    fontSize: '1.5rem',
    borderRadius: '50%',
    backgroundColor: theme.colors.red,
  },
}));

// Exported for tests
export const iconExplanation: { [K in keyof typeof icons]: string } = {
  wheelchair: 'Rollstuhl Plätze',
  bike: 'Fahrrad Stellplätze',
  dining: 'Bordbistro/Restaurant',
  quiet: 'Ruheabteil',
  toddler: 'Kleinkindabteil',
  family: 'Familienbereich',
  disabled: 'Schwerbehindertenplätze',
  info: 'Dienstabteil',
  wifi: 'Wlan online',
  wifiOff: 'Wlan offline',
};

export const Explain = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen((old) => !old);
  }, []);

  return (
    <>
      <div
        className={classes.legende}
        onClick={toggle}
        data-testid="reihungLegendOpener"
      >
        Legende
      </div>
      <Dialog
        data-testid="reihungLegend"
        fullWidth
        open={open}
        onClose={toggle}
        onClick={stopPropagation}
      >
        <DialogContent>
          <h3>Legende Wagenreihung</h3>
          {/* <FahrzeugComp {...explainFahrzeugProps} /> */}
          <div className={classes.wrap}>
            {Object.keys(iconExplanation).map(
              // @ts-ignore this is correct, it's exact!
              (iconName: keyof typeof icons) => {
                const Icon = icons[iconName];

                return (
                  <div
                    className={classes.iconWrap}
                    data-testid={iconName}
                    key={iconName}
                  >
                    <Icon />
                    {iconExplanation[iconName]}
                  </div>
                );
              }
            )}
            <div className={classes.iconWrap} data-testid="bahnComfort">
              <div className={classes.comfort} />
              Bahn.Comfort Sitzplätze
            </div>
          </div>
          <h3>Auslastung</h3>
          <div className={classes.wrap}>
            <div className={classes.iconWrap}>
              <SingleAuslastungsDisplay />
              Unbekannte Auslastung
            </div>
            <div className={classes.iconWrap}>
              <SingleAuslastungsDisplay auslastung={1} />
              Geringe Auslastung
            </div>
            <div className={classes.iconWrap}>
              <SingleAuslastungsDisplay auslastung={2} />
              Hohe Auslastung
            </div>
            <div className={classes.iconWrap}>
              <SingleAuslastungsDisplay auslastung={3} />
              Sehr hohe Auslastung
            </div>
            <div className={classes.iconWrap}>
              <SingleAuslastungsDisplay auslastung={4} />
              Zug ist ausgebucht
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
