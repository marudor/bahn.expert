import { AdditionalFahrzeugInfo, Fahrzeug } from 'types/reihung';
import Accessibility from '@material-ui/icons/Accessibility';
import ActionAccessible from '@material-ui/icons/Accessible';
import ActionMotorcycle from '@material-ui/icons/Motorcycle';
import cc from 'clsx';
import ChildCare from '@material-ui/icons/ChildCare';
import ChildFriendly from '@material-ui/icons/ChildFriendly';
import Info from '@material-ui/icons/InfoOutlined';
import MapsLocalDining from '@material-ui/icons/LocalDining';
import NotificationsOff from '@material-ui/icons/NotificationsOff';
import React, { ComponentType } from 'react';
import SitzplatzInfo from './SitzplatzInfo';
import useStyles from './Fahrzeug.style';
import WagenLink from './WagenLink';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';

export const icons: {
  [key in keyof Required<AdditionalFahrzeugInfo['icons']>]: ComponentType;
} = {
  wheelchair: ActionAccessible,
  bike: ActionMotorcycle,
  dining: MapsLocalDining,
  quiet: NotificationsOff,
  toddler: ChildFriendly,
  family: ChildCare,
  disabled: Accessibility,
  info: Info,
  wifi: Wifi,
  wifiOff: WifiOff,
};

export interface InheritedProps {
  scale: number;
  correctLeft: number;
  type: string;
}

export interface Props extends InheritedProps {
  fahrzeug: Pick<
    Fahrzeug,
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

const FahrzeugComp = ({
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

  // @ts-ignore
  const klasseClassName: keyof typeof classes = `klasse${fahrzeug.additionalInfo.klasse}`;

  return (
    <div
      data-testid={`reihungFahrzeug${fahrzeug.wagenordnungsnummer}`}
      style={position}
      className={cc(classes.main, {
        [classes.closed]: fahrzeug.status === 'GESCHLOSSEN',
        [classes.wrongWing]: wrongWing,
      })}
    >
      <span className={cc(classes.klasse, classes[klasseClassName])} />
      <span className={classes.nummer}>{fahrzeug.wagenordnungsnummer}</span>
      <span className={classes.icons}>
        {Object.entries(fahrzeug.additionalInfo.icons).map(([key, enabled]) => {
          if (enabled) {
            // @ts-ignore this is correct, it's exact!
            const SpecificIcon = icons[key];

            return <SpecificIcon className={classes.icon} />;
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
          {showUIC && fahrzeug.fahrzeugnummer}
        </span>
      }
    </div>
  );
};

export default FahrzeugComp;
