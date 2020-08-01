import { Dialog, DialogContent } from '@material-ui/core';
import { icons } from './Fahrzeug';
import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import { stopPropagation } from 'client/Common/stopPropagation';
import { SyntheticEvent, useCallback, useState } from 'react';
import styled from 'styled-components';

const Legende = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  position: absolute;
  bottom: 0.5em;
  left: 0;
  cursor: pointer;
`;

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  min-width: 16em;
  margin-bottom: 0.2em;
  > svg {
    margin-right: 1em;
  }
  > span {
    font-size: 1em;
    margin-right: 1em;
  }
`;

const Comfort = styled.svg`
  width: 1em;
  height: 1em;
  font-size: 1.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.red};
`;

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
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen((old) => !old);
  }, []);

  return (
    <>
      <Legende onClick={toggle} data-testid="reihungLegendOpener">
        Legende
      </Legende>
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
          <Wrap>
            {Object.keys(iconExplanation).map(
              // @ts-ignore this is correct, it's exact!
              (iconName: keyof typeof icons) => {
                const Icon = icons[iconName];

                return (
                  <IconWrap data-testid={iconName} key={iconName}>
                    <Icon />
                    {iconExplanation[iconName]}
                  </IconWrap>
                );
              }
            )}
            <IconWrap data-testid="bahnComfort">
              <Comfort />
              Bahn.Comfort Sitzplätze
            </IconWrap>
          </Wrap>
          <h3>Auslastung</h3>
          <Wrap>
            <IconWrap>
              <SingleAuslastungsDisplay />
              Unbekannte Auslastung
            </IconWrap>
            <IconWrap>
              <SingleAuslastungsDisplay auslastung={1} />
              Geringe Auslastung
            </IconWrap>
            <IconWrap>
              <SingleAuslastungsDisplay auslastung={2} />
              Hohe Auslastung
            </IconWrap>
            <IconWrap>
              <SingleAuslastungsDisplay auslastung={3} />
              Sehr hohe Auslastung
            </IconWrap>
            <IconWrap>
              <SingleAuslastungsDisplay auslastung={4} />
              Zug ist ausgebucht
            </IconWrap>
          </Wrap>
        </DialogContent>
      </Dialog>
    </>
  );
};
