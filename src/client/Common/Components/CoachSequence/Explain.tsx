import { Dialog, DialogContent } from '@mui/material';
import { icons } from './Coach';
import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';

const OpenLink = styled.div(({ theme }) => ({
  color: theme.colors.blue,
  position: 'absolute',
  bottom: '.5em',
  left: 0,
  cursor: 'pointer',
}));

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  min-width: 16em;
  margin-bottom: 0.2em;
  & > svg {
    margin-right: 1em;
  }
  & > span {
    font-size: 1em;
    margin-right: 1em;
  }
`;

const ComfortIcon = styled.div(({ theme }) => ({
  width: '1em',
  height: '1em',
  fontSize: '1.5rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.red,
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
  wifi: 'WLAN',
  comfort: '',
};

export const Explain: FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen((old) => !old);
  }, []);

  return (
    <>
      <OpenLink onClick={toggle} data-testid="coachSequenceLegendOpener">
        Legende
      </OpenLink>
      <Dialog
        data-testid="coachSequenceLegend"
        fullWidth
        open={open}
        onClose={toggle}
      >
        <DialogContent>
          <h3>Legende Wagenreihung</h3>
          <ContentContainer>
            {Object.keys(iconExplanation).map(
              // @ts-expect-error this is correct, it's exact!
              (iconName: keyof typeof icons) => {
                const Icon = icons[iconName];

                return (
                  Icon && (
                    <IconWrap data-testid={iconName} key={iconName}>
                      <Icon />
                      {iconExplanation[iconName]}
                    </IconWrap>
                  )
                );
              },
            )}
            <IconWrap data-testid="comfort">
              <ComfortIcon />
              BahnBonus Status Sitzplätze
            </IconWrap>
          </ContentContainer>
          <h3>Auslastung</h3>
          <ContentContainer>
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
          </ContentContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};
