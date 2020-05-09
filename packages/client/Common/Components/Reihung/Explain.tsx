import { Dialog, DialogContent } from '@material-ui/core';
import { icons } from './Fahrzeug';
import { SyntheticEvent, useState } from 'react';
import SingleAuslastungsDisplay from 'client/Common/Components/SingleAuslastungsDisplay';
import useStyles from './Explain.style';

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

const Explain = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const toggle = (e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <>
      <div
        onClick={toggle}
        className={classes.link}
        data-testid="reihungLegendOpener"
      >
        Legende
      </div>
      <Dialog
        data-testid="reihungLegend"
        classes={{
          paperFullWidth: classes.dialog,
        }}
        fullWidth
        open={open}
        onClose={toggle}
        onClick={toggle}
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
                    data-testid={iconName}
                    key={iconName}
                    className={classes.icon}
                  >
                    <Icon />
                    {iconExplanation[iconName]}
                  </div>
                );
              }
            )}
            <div data-testid="bahnComfort" className={classes.icon}>
              <svg className={classes.comfort} />
              Bahn.Comfort Sitzplätze
            </div>
          </div>
          <h3>Auslastung</h3>
          <div className={classes.wrap}>
            <div className={classes.icon}>
              <SingleAuslastungsDisplay />
              Unbekannte Auslastung
            </div>
            <div className={classes.icon}>
              <SingleAuslastungsDisplay auslastung={1} />
              Geringe Auslastung
            </div>
            <div className={classes.icon}>
              <SingleAuslastungsDisplay auslastung={2} />
              Hohe Auslastung
            </div>
            <div className={classes.icon}>
              <SingleAuslastungsDisplay auslastung={3} />
              Sehr hohe Auslastung
            </div>
            <div className={classes.icon}>
              <SingleAuslastungsDisplay auslastung={4} />
              Zug ist ausgebucht
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Explain;
