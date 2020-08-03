import {
  Accessibility,
  Accessible,
  ChildCare,
  ChildFriendly,
  InfoOutlined,
  LocalDining,
  Motorcycle,
  NotificationsOff,
  Wifi,
  WifiOff,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { SitzplatzInfo } from './SitzplatzInfo';
import { UIC } from './UIC';
import { WagenLink } from './WagenLink';
import clsx from 'clsx';
import type {
  AdditionalFahrzeugInfo,
  Fahrzeug as FahrzeugType,
} from 'types/reihung';
import type { ComponentType } from 'react';

export const icons: {
  [key in keyof Required<AdditionalFahrzeugInfo['icons']>]: ComponentType;
} = {
  wheelchair: Accessible,
  bike: Motorcycle,
  dining: LocalDining,
  quiet: NotificationsOff,
  toddler: ChildFriendly,
  family: ChildCare,
  disabled: Accessibility,
  info: InfoOutlined,
  wifi: Wifi,
  wifiOff: WifiOff,
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
    background:
      'repeating-linear-gradient(135deg, #999, #999, 5px, transparent 5px, transparent 10px)',
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
}));

export interface InheritedProps {
  scale: number;
  correctLeft: number;
  type: string;
}

export interface Props extends InheritedProps {
  fahrzeug: Pick<
    FahrzeugType,
    | 'fahrzeugtyp'
    | 'wagenordnungsnummer'
    | 'positionamhalt'
    | 'status'
    | 'additionalInfo'
    | 'fahrzeugnummer'
  >;
  destination?: string;
  wrongWing?: boolean;
  showUIC: boolean;
}

export const Fahrzeug = ({
  fahrzeug,
  wrongWing,
  scale,
  correctLeft,
  type,
  showUIC,
}: Props) => {
  const classes = useStyles();
  const { startprozent, endeprozent } = fahrzeug.positionamhalt;
  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const position = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };

  return (
    <div
      className={clsx(classes.wrap, {
        [classes.wrongWing]: wrongWing,
        [classes.closed]: fahrzeug.status === 'GESCHLOSSEN',
      })}
      data-testid={`reihungFahrzeug${fahrzeug.wagenordnungsnummer}`}
      style={position}
    >
      <span
        className={clsx(
          classes.klasse,
          // @ts-expect-error
          classes[`klasse${fahrzeug.additionalInfo.klasse}`]
        )}
      />
      <span className={classes.nummer}>{fahrzeug.wagenordnungsnummer}</span>
      <span>
        {Object.entries(fahrzeug.additionalInfo.icons).map(([key, enabled]) => {
          if (enabled) {
            // @ts-ignore this is correct, it's exact!
            const SpecificIcon = icons[key];

            return <SpecificIcon className={classes.icon} key={key} />;
          }

          return null;
        })}
      </span>
      {fahrzeug.additionalInfo.comfort && <span className={classes.comfort} />}
      <WagenLink
        type={type}
        fahrzeugnummer={fahrzeug.fahrzeugnummer}
        fahrzeugtyp={fahrzeug.fahrzeugtyp}
      />
      {
        <span className={classes.extraInfo}>
          <SitzplatzInfo
            wagenordnungsnummer={fahrzeug.wagenordnungsnummer}
            additionalInfo={fahrzeug.additionalInfo}
          />
          {showUIC && <UIC uic={fahrzeug.fahrzeugnummer} />}
        </span>
      }
    </div>
  );
};
