import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { icons } from './Fahrzeug';
import React, { SyntheticEvent, useState } from 'react';
import useStyles from './Explain.style';

// Exported for tests
export const iconExplanation: { [K in keyof typeof icons]: string } = {
  rollstuhl: 'Rollstuhl Plätze',
  fahrrad: 'Fahrrad Stellplätze',
  speise: 'Bordbistro/Restaurant',
  ruhe: 'Ruheabteil',
  kleinkind: 'Kleinkindabteil',
  familie: 'Familienbereich',
  schwebe: 'Schwerbehindertenplätze',
  info: 'Dienstabteil',
  wifi: 'Wlan online',
  wifiOff: 'Wlan offline',
};

// const explainFahrzeugProps: OwnProps = {
//   scale: 1,
//   correctLeft: 0,
//   type: 'ICE',
//   fahrzeug: {
//     fahrzeugnummer: '938058031296',
//     fahrzeugtyp: 'Apmbsz',
//     wagenordnungsnummer: '9',
//     positionamhalt: {
//       endemeter: '278.16',
//       endeprozent: '70',
//       startmeter: '251.76',
//       startprozent: '30',
//     },
//     status: 'OFFEN',
//     additionalInfo: {
//       klasse: 1,
//       info: true,
//       kleinkind: true,
//       rollstuhl: true,
//       schwebe: true,
//       comfort: true,
//     },
//   },
// };

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
      >
        <DialogTitle>Legende Wagenreihung</DialogTitle>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Explain;
