import {
  Accessibility,
  Accessible,
  ChildCare,
  ChildFriendly,
  InfoOutlined,
  LocalDining,
  Motorcycle,
  NotificationsOff,
  WifiOutlined,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { SitzplatzInfo } from './SitzplatzInfo';
import { UIC } from './UIC';
import { WagenLink } from './WagenLink';
import clsx from 'clsx';
import type {
  AvailableIdentifier,
  CoachSequenceCoach,
  CoachSequenceCoachFeatures,
} from 'types/coachSequence';
import type { ComponentType, FC } from 'react';

export const icons: {
  [key in keyof Required<CoachSequenceCoachFeatures>]: ComponentType | null;
} = {
  wheelchair: Accessible,
  bike: Motorcycle,
  dining: LocalDining,
  quiet: NotificationsOff,
  toddler: ChildFriendly,
  family: ChildCare,
  disabled: Accessibility,
  info: InfoOutlined,
  wifi: WifiOutlined,
  comfort: null,
};

const useStyles = makeStyles((theme) => ({
  icon: {
    width: '.6em',
    height: '.6em',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
  wrap: {
    position: 'absolute',
    height: '2.5em',
    border: `${theme.palette.text.primary} 1px solid`,
    boxSizing: 'border-box',
  },
  closed: {
    background: `repeating-linear-gradient(135deg, ${theme.colors.shadedBackground}, ${theme.colors.shadedBackground}, 5px, transparent 5px, transparent 10px)`,
  },
  wrongWing: {
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
  nummer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 0,
  },
  comfort: {
    position: 'absolute',
    top: '.2em',
    right: '.3em',
    width: '.7em',
    height: '.7em',
    backgroundColor: theme.colors.red,
    borderRadius: '50%',
  },
  extraInfo: {
    position: 'absolute',
    top: '150%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  klasse: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  klasse0: {
    '&::after': {
      content: '"?"',
    },
  },
  klasse1: {
    backgroundColor: theme.colors.yellow,
    color: theme.palette.getContrastText(theme.colors.yellow),
    '&::after': {
      content: '"1"',
    },
  },
  klasse2: {
    backgroundColor: theme.colors.red,
    color: theme.palette.getContrastText(theme.colors.red),
    '&::after': {
      content: '"2"',
    },
  },
  klasse3: {
    background: `linear-gradient(to right, ${theme.colors.yellow}, ${theme.colors.red})`,
    '&::after': {
      content: '"1/2"',
    },
  },
  klasse4: {
    right: '50%',
    transform: 'translateX(50%)',
    '&::after': {
      content: '"LOK"',
    },
  },
  doppelstock: {
    position: 'absolute',
    height: '1px',
    top: '45%',
    left: 0,
    right: 0,
    backgroundImage: `linear-gradient(to right, ${theme.palette.text.primary} 33%, transparent 0%)`,
    backgroundSize: '8px 1px',
    backgroundRepeat: 'repeat-x',
  },
}));

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
}

export const Fahrzeug: FC<Props> = ({
  fahrzeug,
  wrongWing,
  scale,
  correctLeft,
  showUIC,
  identifier,
  type,
}) => {
  const classes = useStyles();
  const { startPercent, endPercent } = fahrzeug.position;

  const position = {
    left: `${(startPercent - correctLeft) * scale}%`,
    width: `${(endPercent - startPercent) * scale}%`,
  };

  return (
    <div
      className={clsx(classes.wrap, {
        [classes.wrongWing]: wrongWing && !fahrzeug.closed,
        [classes.closed]: fahrzeug.closed,
      })}
      data-testid={`reihungFahrzeug${fahrzeug.identificationNumber}`}
      style={position}
    >
      {fahrzeug.category.includes('DOPPELSTOCK') && (
        <span className={classes.doppelstock} />
      )}
      <span
        className={clsx(
          classes.klasse,
          classes[`klasse${fahrzeug.class}` as const],
        )}
      />
      {fahrzeug.identificationNumber && (
        <span className={classes.nummer}>{fahrzeug.identificationNumber}</span>
      )}
      <span>
        {Object.entries(fahrzeug.features).map(([key, enabled]) => {
          if (enabled) {
            // @ts-expect-error this is correct, it's exact!
            const SpecificIcon = icons[key];
            if (!SpecificIcon) return null;
            return <SpecificIcon className={classes.icon} key={key} />;
          }

          return null;
        })}
      </span>
      {fahrzeug.features.comfort && <span className={classes.comfort} />}
      <WagenLink fahrzeug={fahrzeug} identifier={identifier} type={type} />
      <span className={classes.extraInfo}>
        <SitzplatzInfo
          identificationNumber={fahrzeug.identificationNumber}
          seats={fahrzeug.seats}
        />
        {showUIC && <UIC uic={fahrzeug.uic} />}
      </span>
    </div>
  );
};
