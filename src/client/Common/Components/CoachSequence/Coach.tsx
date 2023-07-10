import {
  Accessibility,
  Accessible,
  ChildCare,
  ChildFriendly,
  InfoOutlined,
  LocalDining,
  NotificationsOff,
  PedalBike,
  WifiOutlined,
} from '@mui/icons-material';
import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import { SitzplatzInfo } from './SitzplatzInfo';
import { UIC } from './UIC';
import { WagenLink } from './WagenLink';
import styled from '@emotion/styled';
import type {
  AvailableIdentifier,
  CoachSequenceCoach,
  CoachSequenceCoachFeatures,
} from '@/types/coachSequence';
import type { ComponentType, FC } from 'react';

const DummyIcon = styled.span(({ theme }) => ({
  width: '.6em',
  height: '.6em',
  [theme.breakpoints.down('md')]: {
    fontSize: 16,
  },
}));

export const icons: {
  [key in keyof Required<CoachSequenceCoachFeatures>]: ComponentType | null;
} = {
  wheelchair: DummyIcon.withComponent(Accessible),
  bike: DummyIcon.withComponent(PedalBike),
  dining: DummyIcon.withComponent(LocalDining),
  quiet: DummyIcon.withComponent(NotificationsOff),
  toddler: DummyIcon.withComponent(ChildFriendly),
  family: DummyIcon.withComponent(ChildCare),
  disabled: DummyIcon.withComponent(Accessibility),
  info: DummyIcon.withComponent(InfoOutlined),
  wifi: DummyIcon.withComponent(WifiOutlined),
  comfort: null,
};

const Container = styled.div<{
  wrongWing?: boolean;
  closed?: boolean;
}>(
  ({ theme }) => ({
    position: 'absolute',
    height: '2.5em',
    border: `${theme.palette.text.primary} 1px solid`,
    boxSizing: 'border-box',
  }),
  ({ theme, closed }) =>
    closed && {
      background: `repeating-linear-gradient(135deg, ${theme.colors.shadedBackground}, ${theme.colors.shadedBackground}, 5px, transparent 5px, transparent 10px)`,
    },
  ({ theme, wrongWing }) =>
    wrongWing && {
      background: theme.colors.shadedBackground,
      '&::after': {
        content: '""',
        top: -1,
        left: -1,
        right: -1,
        bottom: '-3.7em',
        pointerEvents: 'none',
        zIndex: 5,
        background: theme.colors.transparentBackground,
      },
    },
);

const DoppelstockIndicator = styled.span(({ theme }) => ({
  position: 'absolute',
  height: '1px',
  top: '45%',
  left: 0,
  right: 0,
  backgroundImage: `linear-gradient(to right, ${theme.palette.text.primary} 33%, transparent 0%)`,
  backgroundSize: '8px 1px',
  backgroundRepeat: 'repeat-x',
}));

const Fahrzeugklasse = styled.span<{ coach: CoachSequenceCoach }>(
  {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  ({ coach, theme }) => {
    switch (coach.class) {
      case 0: {
        return {
          '&::after': {
            content: '"?"',
          },
        };
      }
      case 1: {
        return {
          backgroundColor: theme.colors.yellow,
          color: theme.palette.getContrastText(theme.colors.yellow),
          '&::after': {
            content: '"1"',
          },
        };
      }
      case 2: {
        return {
          backgroundColor: theme.colors.red,
          color: theme.palette.getContrastText(theme.colors.red),
          '&::after': {
            content: '"2"',
          },
        };
      }
      case 3: {
        return {
          background: `linear-gradient(to right, ${theme.colors.yellow}, ${theme.colors.red})`,
          '&::after': {
            content: '"1/2"',
          },
        };
      }
      case 4: {
        return {
          right: '50%',
          transform: 'translateX(50%)',
          '&::after': {
            content: '"LOK"',
          },
        };
      }
    }
  },
);

const IdentificationNumber = styled.span`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
`;

const ComfortIcon = styled.span(({ theme }) => ({
  position: 'absolute',
  top: '.2em',
  right: '.3em',
  width: '.7em',
  height: '.7em',
  backgroundColor: theme.colors.red,
  borderRadius: '50%',
}));

const ExtraInfoContainer = styled.span<{ showCoachType: boolean }>(
  {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  ({ showCoachType }) => ({
    top: showCoachType ? '150%' : '100%',
  }),
);

const PositionedSingleAuslastungsDisplay = styled(SingleAuslastungsDisplay)`
  position: absolute;
  left: 0;
  bottom: 0;
`;

export interface InheritedProps {
  scale: number;
  correctLeft: number;
  type: string;
}

export interface Props extends InheritedProps {
  identifier?: AvailableIdentifier;
  fahrzeug: CoachSequenceCoach;
  destination?: string;
  wrongWing?: boolean;
  showUIC: boolean;
  showCoachType: boolean;
  Stripe?: FC;
  'data-testid'?: string;
}

export const Coach: FC<Props> = ({
  fahrzeug,
  wrongWing,
  scale,
  correctLeft,
  showUIC,
  showCoachType,
  identifier,
  type,
  Stripe,
}) => {
  const { startPercent, endPercent } = fahrzeug.position;

  const position = {
    left: `${(startPercent - correctLeft) * scale}%`,
    width: `${(endPercent - startPercent) * scale}%`,
  };

  return (
    <Container
      wrongWing={wrongWing && !fahrzeug.closed}
      closed={fahrzeug.closed}
      data-testid={`coachSequenceCoach${fahrzeug.identificationNumber}`}
      style={position}
    >
      {Stripe && <Stripe />}
      {fahrzeug.vehicleCategory.includes('DOUBLEDECK') && (
        <DoppelstockIndicator />
      )}
      <Fahrzeugklasse coach={fahrzeug} />
      {fahrzeug.occupancy && (
        <PositionedSingleAuslastungsDisplay auslastung={fahrzeug.occupancy} />
      )}
      {fahrzeug.identificationNumber && (
        <IdentificationNumber>
          {fahrzeug.identificationNumber}
        </IdentificationNumber>
      )}
      <span>
        {Object.entries(fahrzeug.features).map(([key, enabled]) => {
          if (enabled) {
            // @ts-expect-error this is correct, it's exact!
            const SpecificIcon = icons[key];
            if (!SpecificIcon) return null;
            return <SpecificIcon key={key} />;
          }

          return null;
        })}
      </span>
      {fahrzeug.features.comfort && <ComfortIcon />}
      {showCoachType && (
        <WagenLink fahrzeug={fahrzeug} identifier={identifier} type={type} />
      )}
      <ExtraInfoContainer showCoachType={showCoachType}>
        {showUIC && <UIC uic={fahrzeug.uic} />}
        <SitzplatzInfo
          identificationNumber={fahrzeug.identificationNumber}
          seats={fahrzeug.seats}
        />
      </ExtraInfoContainer>
    </Container>
  );
};
